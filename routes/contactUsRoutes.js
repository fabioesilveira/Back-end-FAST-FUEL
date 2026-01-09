const express = require("express");
const connection = require("../connection");

const router = express.Router();

/**
 * GET /contact-us?replied=0|1&email=...&order_code=ABC123
 */
router.get("/", async (req, res) => {
  try {
    const { replied, email, order_code } = req.query;

    let sql = `
      SELECT 
        id, name, email, order_code, phone, subject, message,
        created_at, replied, replied_at
      FROM contactUs
      WHERE 1=1
    `;
    const params = [];

    if (replied !== undefined) {
      sql += " AND replied = ?";
      params.push(Number(replied) ? 1 : 0);
    }

    if (email) {
      sql += " AND email LIKE ?";
      params.push(`%${email}%`);
    }

    if (order_code) {
      sql += " AND order_code = ?";
      params.push(String(order_code));
    }

    sql += " ORDER BY created_at DESC";

    const [result] = await connection.execute(sql, params);
    return res.json(result);
  } catch (err) {
    console.error("CONTACT-US GET ERROR:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

/**
 * GET /contact-us/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      `
      SELECT 
        id, name, email, order_code, phone, subject, message,
        created_at, replied, replied_at
      FROM contactUs
      WHERE id = ?
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    return res.json(result[0]);
  } catch (err) {
    console.error("CONTACT-US GET/:id ERROR:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

/**
 * helper: normaliza order_code
 * - aceita order_code ou orderNumber
 * - remove não dígitos
 * - só aceita 6 dígitos
 * - ignora "", null, undefined, "0"
 */
function normalizeOrderCode({ order_code, orderNumber }) {
  const raw =
    (order_code != null ? String(order_code).trim() : "") ||
    (orderNumber != null ? String(orderNumber).trim() : "");

  if (!raw || raw === "0") return null;

  const cleaned = raw.replace(/\D/g, "");
  if (cleaned.length !== 6) return null;

  return cleaned;
}

/**
 * POST /contact-us
 * body: { name, email, order_code? | orderNumber?, phone?, subject, message }
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const safeOrderCode = normalizeOrderCode(req.body); // ✅ aqui

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: "name, email, subject, message are required" });
    }

    let finalOrderCode = safeOrderCode;
    if (finalOrderCode) {
      const [exists] = await connection.execute(
        "SELECT 1 FROM sales WHERE order_code = ? LIMIT 1",
        [finalOrderCode]
      );
      if (exists.length === 0) {
        finalOrderCode = null;
      }
    }

    const [result] = await connection.execute(
      `
      INSERT INTO contactUs (name, email, order_code, phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, finalOrderCode, phone ?? null, subject, message]
    );

    const [rows] = await connection.execute(
      `
      SELECT 
        id, name, email, order_code, phone, subject, message,
        created_at, replied, replied_at
      FROM contactUs
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("CONTACT-US POST ERROR:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

/**
 * PATCH /contact-us/:id/reply
 */
router.patch("/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;

    const [update] = await connection.execute(
      `
      UPDATE contactUs
      SET replied = 1,
          replied_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ msg: "Message not found" });
    }

    const [rows] = await connection.execute(
      `
      SELECT 
        id, name, email, order_code, phone, subject, message,
        created_at, replied, replied_at
      FROM contactUs
      WHERE id = ?
      `,
      [id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("CONTACT-US PATCH reply ERROR:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
