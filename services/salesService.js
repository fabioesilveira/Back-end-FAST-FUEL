const { findAllSales, findSaleById } = require("../models/salesModel");
const {
    parseSaleRow,
    normalizeItems,
    round2,
    genOrderCode,
    genPaymentRef,
} = require("../utils/sales");
const connection = require("../connection");

const VALID_STATUS = new Set(["received", "in_progress", "sent", "completed"]);
const VALID_PAYMENT_METHOD = new Set(["card", "apple_pay", "google_pay", "cash"]);

const TAX_RATE = 0.09;
const DELIVERY_FEE = 9.99;
const FREE_DELIVERY_THRESHOLD = 30.0;

async function calcTotalsFromDb(itemsNorm) {
    if (!itemsNorm || itemsNorm.length === 0) {
        return {
            subtotal: 0,
            discount: 0,
            tax: 0,
            delivery_fee: 0,
            total: 0,
            sets: 0,
            burgerCount: 0,
            sideCount: 0,
            beverageCount: 0,
        };
    }

    const ids = [...new Set(itemsNorm.map((x) => x.id))];

    const [rows] = await connection.execute(
        `SELECT id, price, category
     FROM products
     WHERE id IN (${ids.map(() => "?").join(",")})`,
        ids
    );

    const byId = new Map(rows.map((p) => [String(p.id), p]));

    const missing = ids.filter((id) => !byId.has(String(id)));
    if (missing.length) {
        const err = new Error(`Missing products: ${missing.join(", ")}`);
        err.statusCode = 400;
        throw err;
    }

    let subtotal = 0;
    let burgerCount = 0;
    let sideCount = 0;
    let beverageCount = 0;

    for (const it of itemsNorm) {
        const p = byId.get(String(it.id));
        const price = Number(p.price || 0);
        const qty = it.qty;

        subtotal += price * qty;

        const cat = String(p.category || "").toLowerCase();
        if (cat === "sandwiches") burgerCount += qty;
        else if (cat === "sides") sideCount += qty;
        else if (cat === "beverages") beverageCount += qty;
    }

    subtotal = round2(subtotal);

    const sets = Math.min(burgerCount, sideCount, beverageCount);
    const discount = round2(sets * 2);

    const taxableBase = Math.max(0, subtotal - discount);
    const tax = round2(taxableBase * TAX_RATE);

    const delivery_fee = taxableBase >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

    const total = round2(taxableBase + tax + delivery_fee);

    return {
        subtotal,
        discount,
        tax,
        delivery_fee: round2(delivery_fee),
        total,
        sets,
        burgerCount,
        sideCount,
        beverageCount,
    };
}


// (helper) busca produtos e monta snapshot (pra Orders page)
async function buildItemsSnapshot(itemsNorm) {
    if (!itemsNorm || itemsNorm.length === 0) return [];

    const ids = [...new Set(itemsNorm.map((x) => x.id))];

    const [rows] = await connection.execute(
        `SELECT id, name, price, category, image
     FROM products
     WHERE id IN (${ids.map(() => "?").join(",")})`,
        ids
    );

    const byId = new Map(rows.map((p) => [String(p.id), p]));

    return itemsNorm.map((it) => {
        const p = byId.get(String(it.id));
        return {
            id: String(it.id),
            name: p?.name ?? "Item",
            price: Number(p?.price ?? 0),
            category: p?.category ?? null,
            image: p?.image ?? null,
            qty: it.qty,
        };
    });
}

async function updateSaleStatusService(id, newStatus) {
    if (!newStatus) {
        return { msg: "status is required", status: 400 };
    }

    if (!VALID_STATUS.has(newStatus)) {
        return { msg: "Invalid status", status: 400 };
    }

    const [rows] = await connection.execute(
        "SELECT status FROM sales WHERE id = ?",
        [id]
    );

    if (!rows || rows.length === 0) {
        return { msg: "Order not found", status: 404 };
    }

    const current = rows[0].status;

    const allowed =
        (current === "received" && newStatus === "in_progress") ||
        (current === "in_progress" && newStatus === "sent");

    if (!allowed) {
        return {
            msg: `Invalid transition: ${current} -> ${newStatus}`,
            status: 400,
        };
    }

    if (newStatus === "in_progress") {
        await connection.execute(
            `UPDATE sales
       SET status = 'in_progress', accepted_at = NOW()
       WHERE id = ?`,
            [id]
        );
    }

    if (newStatus === "sent") {
        await connection.execute(
            `UPDATE sales
       SET status = 'sent', sent_at = NOW()
       WHERE id = ?`,
            [id]
        );
    }

    return { ok: true };
}



async function getAllSalesService(query) {
    const { status, user_id, order_code, email } = query;

    let statusList = [];

    if (status) {
        const raw = String(status).trim();
        const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);

        for (const s of parts) {
            if (!VALID_STATUS.has(s)) {
                return { msg: `Invalid status: ${s}`, status: 400 };
            }
        }

        statusList = parts;
    }

    const rows = await findAllSales({
        statusList,
        user_id,
        order_code,
        email,
    });

    return rows.map(parseSaleRow);
}

async function getSaleByIdService(id) {
    const rows = await findSaleById(id);

    if (!rows || rows.length === 0) {
        return { msg: "Sale not found", status: 404 };
    }

    return parseSaleRow(rows[0]);
}

async function quoteSalesService(items) {
    if (!items) {
        return { msg: "items is required", status: 400 };
    }

    const itemsNorm = normalizeItems(items);

    if (!itemsNorm) {
        return { msg: "items must be an array", status: 400 };
    }

    if (itemsNorm.length === 0) {
        return { msg: "items cannot be empty", status: 400 };
    }

    const breakdown = await calcTotalsFromDb(itemsNorm);

    return {
        ...breakdown,
        rules: {
            tax_rate: TAX_RATE,
            delivery_fee: DELIVERY_FEE,
            free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
        },
    };
}

async function createSaleService(payload) {
    const {
        user_id = null,
        customer_name = null,
        customer_email = null,
        items,
        payment_method = "card",
        delivery_address = null,
    } = payload;

    if (!items) {
        return { msg: "items is required", status: 400 };
    }

    const itemsNorm = normalizeItems(items);

    if (!itemsNorm) {
        return { msg: "items must be an array", status: 400 };
    }

    if (itemsNorm.length === 0) {
        return { msg: "items cannot be empty", status: 400 };
    }

    const breakdown = await calcTotalsFromDb(itemsNorm);
    const itemsSnapshot = await buildItemsSnapshot(itemsNorm);

    let order_code = null;

    for (let i = 0; i < 8; i++) {
        const code = genOrderCode();
        const [check] = await connection.execute(
            "SELECT id FROM sales WHERE order_code = ? LIMIT 1",
            [code]
        );

        if (check.length === 0) {
            order_code = code;
            break;
        }
    }

    if (!order_code) {
        return { msg: "Failed to generate order code", status: 500 };
    }

    const itemsJson = JSON.stringify(itemsNorm);
    const itemsSnapshotJson = JSON.stringify(itemsSnapshot);
    const deliveryAddressJson = delivery_address ? JSON.stringify(delivery_address) : null;

    const payMethod = VALID_PAYMENT_METHOD.has(payment_method) ? payment_method : "card";
    const payment_status = payMethod === "cash" ? "pending" : "approved";
    const payment_ref = genPaymentRef();

    const [result] = await connection.execute(
        `INSERT INTO sales (
      order_code, user_id, customer_name, customer_email, delivery_address,
      payment_method, payment_status, payment_ref,
      items, items_snapshot,
      subtotal, discount, tax, delivery_fee, total,
      tax_rate, delivery_fee_base, free_delivery_threshold,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received')`,
        [
            order_code,
            user_id,
            customer_name,
            customer_email,
            deliveryAddressJson,
            payMethod,
            payment_status,
            payment_ref,
            itemsJson,
            itemsSnapshotJson,
            breakdown.subtotal,
            breakdown.discount,
            breakdown.tax,
            breakdown.delivery_fee,
            breakdown.total,
            TAX_RATE,
            DELIVERY_FEE,
            FREE_DELIVERY_THRESHOLD,
        ]
    );

    return {
        id: result.insertId,
        order_code,
        status: "received",
        delivery_address: delivery_address ?? null,
        payment_method: payMethod,
        payment_status,
        payment_ref,
        items: itemsNorm,
        items_snapshot: itemsSnapshot,
        ...breakdown,
        rules: {
            tax_rate: TAX_RATE,
            delivery_fee: DELIVERY_FEE,
            free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
        },
    };
}

async function confirmSaleReceivedService(id) {
    const [rows] = await connection.execute(
        "SELECT status FROM sales WHERE id = ?",
        [id]
    );

    if (!rows || rows.length === 0) {
        return { msg: "Order not found", status: 404 };
    }

    if (rows[0].status !== "sent") {
        return { msg: "Order is not marked as sent yet", status: 400 };
    }

    await connection.execute(
        `UPDATE sales
     SET status = 'completed', received_confirmed_at = NOW()
     WHERE id = ?`,
        [id]
    );

    return { ok: true };
}


module.exports = {
    getAllSalesService,
    getSaleByIdService,
    quoteSalesService,
    createSaleService,
    updateSaleStatusService,
    confirmSaleReceivedService,
};