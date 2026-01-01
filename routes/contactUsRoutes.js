const express = require("express");
const connection = require("../connection");

const router = express.Router();


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
 * POST /contact-us
 * Aceita:
 * - order_code (novo, preferido)
 * - orderNumber (legacy) -> converte pra string e usa como order_code se fizer sentido
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, order_code, orderNumber, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: "name, email, subject, message are required" });
    }

    // compat: se vier orderNumber antigo, tenta usar como order_code (ex: "456789")
    const normalizedOrderCode =
      (order_code && String(order_code).trim()) ||
      (orderNumber !== undefined && orderNumber !== null ? String(orderNumber).trim() : null);

    const safeOrderCode =
      normalizedOrderCode && normalizedOrderCode.length ? normalizedOrderCode : null;

    const [result] = await connection.execute(
      `
      INSERT INTO contactUs (name, email, order_code, phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, safeOrderCode, phone ?? null, subject, message]
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
