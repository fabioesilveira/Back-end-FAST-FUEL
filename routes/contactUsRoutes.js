const express = require("express");
const connection = require("../connection");
const { normalizeOrderCode } = require("../utils/normalizeOrderCode");
const {
    getAllContactsController,
    getContactByIdController,
} = require("../controllers/contactUsController");
const router = express.Router();


/** GET /contact-us? **/
router.get("/", getAllContactsController);

/** GET /contact-us/:id **/
router.get("/:id", getContactByIdController);


/**
 * POST /contact-us
 * body: { name, email, order_code? | orderNumber?, phone?, subject, message }
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const safeOrderCode = normalizeOrderCode(req.body); 

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
