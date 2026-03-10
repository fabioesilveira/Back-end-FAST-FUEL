// routes/sales.js
const express = require("express");
const connection = require("../connection");
const {
  getAllSalesController,
  getSaleByIdController,
  quoteSalesController,
  createSaleController,
  updateSaleStatusController,
} = require("../controllers/salesController");

const router = express.Router();

// GET /sales
router.get("/", getAllSalesController);

// GET /sales/:id
router.get("/:id", getSaleByIdController);

/** POST /sales/quote */
router.post("/quote", quoteSalesController);

// POST /sales
router.post("/", createSaleController);

/** PATCH /sales/ Admin muda status (received -> in_progress -> sent  */
router.patch("/:id/status", updateSaleStatusController);

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
