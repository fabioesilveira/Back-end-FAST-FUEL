const express = require("express");
const connection = require("../connection");

const router = express.Router();

function genOrderCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const VALID_STATUS = new Set(["received", "in_progress", "sent", "completed"]);

// Rules Fees
const TAX_RATE = 0.09;
const DELIVERY_FEE = 9.99;
const FREE_DELIVERY_THRESHOLD = 30.0;

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function normalizeItems(items) {
  // aceita string JSON ou array
  let parsed = items;
  if (typeof items === "string") {
    try {
      parsed = JSON.parse(items);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(parsed)) return null;

  const norm = parsed
    .map((it) => {
      const id = it?.id ?? it?.product_id ?? it?.productId;
      const qtyRaw =
        it?.quantidade ?? it?.quantity ?? it?.qty ?? 1;

      const qty = Math.max(1, Number(qtyRaw) || 1);

      if (id === undefined || id === null) return null;

      return { id: String(id), qty };
    })
    .filter(Boolean);

  return norm;
}

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

// GET /sales
router.get("/", async (req, res) => {
  try {
    const { status, user_id, order_code, email } = req.query;

    let sql = "SELECT * FROM sales WHERE 1=1";
    const params = [];

    if (status) {
      const raw = String(status).trim();
      const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);

      for (const s of parts) {
        if (!VALID_STATUS.has(s)) {
          return res.status(400).json({ msg: `Invalid status: ${s}` });
        }
      }

      if (parts.length === 1) {
        sql += " AND status = ?";
        params.push(parts[0]);
      } else {
        sql += ` AND status IN (${parts.map(() => "?").join(",")})`;
        params.push(...parts);
      }
    }

    if (user_id) {
      sql += " AND user_id = ?";
      params.push(user_id);
    }

    if (order_code) {
      sql += " AND order_code LIKE ?";
      params.push(`%${String(order_code).trim()}%`);
    }

    if (email) {
      sql += " AND customer_email LIKE ?";
      params.push(`%${String(email).trim()}%`);
    }

    sql += " ORDER BY created_at DESC";

    const [result] = await connection.execute(sql, params);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load sales" });
  }
});

// GET /sales/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      "SELECT * FROM sales WHERE id = ?",
      [id]
    );

    if (result.length === 0) return res.status(404).json({ msg: "cannot find" });
    return res.json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load sale" });
  }
});

/**
 * POST /sales/quote 
 * retorna breakdown sem salvar
 */
router.post("/quote", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items) return res.status(400).json({ msg: "items is required" });

    const itemsNorm = normalizeItems(items);
    if (!itemsNorm) return res.status(400).json({ msg: "items must be an array" });
    if (itemsNorm.length === 0) return res.status(400).json({ msg: "items cannot be empty" });

    const breakdown = await calcTotalsFromDb(itemsNorm);

    return res.json({
      ...breakdown,
      rules: {
        tax_rate: TAX_RATE,
        delivery_fee: DELIVERY_FEE,
        free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
      },
    });
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ msg: e.message || "Failed to quote totals" });
  }
});

// POST /sales
router.post("/", async (req, res) => {
  try {
    const {
      user_id = null,
      customer_name = null,
      customer_email = null,
      items,
    } = req.body;

    if (!items) return res.status(400).json({ msg: "items is required" });

    const itemsNorm = normalizeItems(items);
    if (!itemsNorm) return res.status(400).json({ msg: "items must be an array" });
    if (itemsNorm.length === 0) return res.status(400).json({ msg: "items cannot be empty" });

    const breakdown = await calcTotalsFromDb(itemsNorm);

    // order_code único
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
    if (!order_code) return res.status(500).json({ msg: "Failed to generate order code" });

    // salva o JSON normalizado (id + qty) 
    const itemsJson = JSON.stringify(itemsNorm);

    const [result] = await connection.execute(
      `INSERT INTO sales
        (
          order_code, user_id, customer_name, customer_email, items,
          subtotal, discount, tax, delivery_fee, total,
          tax_rate, delivery_fee_base, free_delivery_threshold,
          status
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received')`,
      [
        order_code,
        user_id,
        customer_name,
        customer_email,
        itemsJson,
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

    return res.status(201).json({
      id: result.insertId,
      order_code,
      status: "received",
      ...breakdown,
      rules: {
        tax_rate: TAX_RATE,
        delivery_fee: DELIVERY_FEE,
        free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
      },
    });
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ msg: e.message || "Failed to create sale" });
  }
});

/**
 * PATCH /sales/:id/status
 * Admin muda status (received -> in_progress -> sent)
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ msg: "status is required" });
    if (!VALID_STATUS.has(status)) return res.status(400).json({ msg: "Invalid status" });

    const [rows] = await connection.execute("SELECT status FROM sales WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Order not found" });

    const current = rows[0].status;

    const allowed =
      (current === "received" && status === "in_progress") ||
      (current === "in_progress" && status === "sent");

    if (!allowed) {
      return res.status(400).json({ msg: `Invalid transition: ${current} -> ${status}` });
    }

    if (status === "in_progress") {
      await connection.execute(
        `UPDATE sales SET status = 'in_progress', accepted_at = NOW() WHERE id = ?`,
        [id]
      );
    }

    if (status === "sent") {
      await connection.execute(
        `UPDATE sales SET status = 'sent', sent_at = NOW() WHERE id = ?`,
        [id]
      );
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to update status" });
  }
});

/**
 * PATCH /sales/:id/confirm-received
 * User confirma recebimento (sent -> completed)
 */
router.patch("/:id/confirm-received", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await connection.execute("SELECT status FROM sales WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Order not found" });
    if (rows[0].status !== "sent") {
      return res.status(400).json({ msg: "Order is not marked as sent yet" });
    }

    await connection.execute(
      `UPDATE sales
       SET status = 'completed', received_confirmed_at = NOW()
       WHERE id = ?`,
      [id]
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to confirm received" });
  }
});

module.exports = router;
