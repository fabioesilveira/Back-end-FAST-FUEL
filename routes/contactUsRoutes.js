const express = require("express");
const connection = require("../connection");
const router = express.Router();
const {
    getAllContactsController,
    getContactByIdController,
    createContactController,
} = require("../controllers/contactUsController");


/** GET /contact-us? **/
router.get("/", getAllContactsController);

/** GET /contact-us/:id **/
router.get("/:id", getContactByIdController);

/** POST * body: { name, email, order_code? | orderNumber?, phone?, subject, message }*/
router.post("/", createContactController);


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
