const { findAllSales, findSaleById } = require("../models/salesModel");
const { parseSaleRow, normalizeItems, round2 } = require("../utils/sales");
const connection = require("../connection");

const VALID_STATUS = new Set(["received", "in_progress", "sent", "completed"]);

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


module.exports = {
  getAllSalesService,
  getSaleByIdService,
  quoteSalesService,
};