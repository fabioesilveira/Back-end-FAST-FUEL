const express = require("express");
const connection = require("../connection");

const router = express.Router();

// helper: gerar order_code de 6 dígitos (string)
function genOrderCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const VALID_STATUS = new Set(["received", "in_progress", "sent", "completed"]);

router.get("/", async (req, res) => {
  try {
    const { status, user_id, order_code, email } = req.query;

    let sql = "SELECT * FROM sales WHERE 1=1";
    const params = [];

    if (status) {
      const raw = String(status).trim();

      // permite "in_progress,sent" (opcional)
      const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);

      // valida todos
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

// POST /sales
router.post("/", async (req, res) => {
  try {
    const {
      user_id = null,
      customer_name = null,
      customer_email = null,
      items,
      subtotal = 0,
      discount = 0,
      total = 0,
    } = req.body;

    if (!items) return res.status(400).json({ msg: "items is required" });

    // gera order_code único
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

    const itemsJson = typeof items === "string" ? items : JSON.stringify(items);

    const [result] = await connection.execute(
      `INSERT INTO sales
        (order_code, user_id, customer_name, customer_email, items, subtotal, discount, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received')`,
      [order_code, user_id, customer_name, customer_email, itemsJson, subtotal, discount, total]
    );

    return res.status(201).json({
      id: result.insertId,
      order_code,
      status: "received",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to create sale" });
  }
});

/**
 * PATCH /sales/:id/status
 * Admin muda status com validação (received -> in_progress -> sent)
 * body: { status: 'in_progress' | 'sent' }
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ msg: "status is required" });
    if (!VALID_STATUS.has(status)) return res.status(400).json({ msg: "Invalid status" });

    // pega status atual
    const [rows] = await connection.execute("SELECT status FROM sales WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Order not found" });

    const current = rows[0].status;

    // valida transições (admin só pode avançar até sent)
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
