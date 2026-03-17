const express = require("express");
const {
  getAllSalesController,
  getSaleByIdController,
  quoteSalesController,
  createSaleController,
  trackSaleController,
  updateSaleStatusController,
  confirmSaleReceivedController,
  getMyOrdersController
} = require("../controllers/salesController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

// GET /sales
router.get("/", authMiddleware, requireAdmin, getAllSalesController);

// GET /sales/:id
router.get("/:id", authMiddleware, requireAdmin, getSaleByIdController);

// POST /sales/quote */
router.post("/quote", quoteSalesController);

// POST /
router.post("/", createSaleController);

// POST /sales /track
router.post("/track", trackSaleController);

// Get LoggedUser
router.get("/my-orders", authMiddleware, getMyOrdersController);

/** PATCH /sales/:id/status - Admin updates order status */
router.patch("/:id/status", authMiddleware, requireAdmin, updateSaleStatusController);

/** PATCH /sales/:id/confirm-received - Customer confirms order received */
router.patch("/:id/confirm-received", confirmSaleReceivedController);


module.exports = router;
