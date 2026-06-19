const express = require("express");

const {
  getAllSalesController,
  getSaleByIdController,
  quoteSalesController,
  createSaleController,
  trackSaleController,
  updateSaleStatusController,
  confirmSaleReceivedController,
  getMyOrdersController,
} = require("../controllers/salesController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

// Public
router.post("/quote", quoteSalesController);
router.post("/track", trackSaleController);
router.post("/", createSaleController);

// Logged user
router.get("/my-orders", authMiddleware, getMyOrdersController);

// Customer
router.patch("/:id/confirm-received", confirmSaleReceivedController);

// Admin only
router.get("/", authMiddleware, requireAdmin, getAllSalesController);
router.get("/:id", authMiddleware, requireAdmin, getSaleByIdController);
router.patch("/:id/status", authMiddleware, requireAdmin, updateSaleStatusController);

module.exports = router;