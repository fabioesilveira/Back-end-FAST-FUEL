const express = require("express");
const connection = require("../connection");

const router = express.Router();

// helper: gerar order_code de 6 dígitos (string)
function genOrderCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}


router.get("/", async (req, res) => {
  try {
    const { status, user_id, order_code } = req.query;

    let sql = "SELECT * FROM sales WHERE 1=1";
    const params = [];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    if (user_id) {
      sql += " AND user_id = ?";
      params.push(user_id);
    }

    if (order_code) {
      sql += " AND order_code = ?";
      params.push(order_code);
    }

    sql += " ORDER BY created_at DESC";

    const [result] = await connection.execute(sql, params);
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load sales" });
  }
});

/**
 * GET /sales/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute(
      "SELECT * FROM sales WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "cannot find" });
    }

    return res.json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load sale" });
  }
});


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

    if (!items) {
      return res.status(400).json({ msg: "items is required" });
    }

    // tenta gerar um order_code único (até 5 tentativas)
    let order_code = null;
    for (let i = 0; i < 5; i++) {
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
      return res.status(500).json({ msg: "Failed to generate order code" });
    }

    // MySQL JSON: manda string JSON
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
 * Admin muda status (received -> in_progress -> sent)
 * body: { status: 'received'|'in_progress'|'sent'|'completed' }
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ msg: "status is required" });

    if (status === "sent") {
      await connection.execute(
        `UPDATE sales SET status = ?, sent_at = NOW() WHERE id = ?`,
        [status, id]
      );
    } else {
      await connection.execute(
        `UPDATE sales SET status = ? WHERE id = ?`,
        [status, id]
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
