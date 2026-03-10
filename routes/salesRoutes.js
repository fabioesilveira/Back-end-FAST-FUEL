const express = require("express");
const {
  getAllSalesController,
  getSaleByIdController,
  quoteSalesController,
  createSaleController,
  updateSaleStatusController,
  confirmSaleReceivedController,
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

/** PATCH /sales/:id/User confirma recebimento (sent -> completed) */
router.patch("/:id/confirm-received", confirmSaleReceivedController);


module.exports = router;
