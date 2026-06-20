const express = require("express");

const {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
  updateProductPriceController,
  removeProductController,
  getCategoryInsightsController,
} = require("../controllers/productsController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

// Public

// GET all products
router.get("/", getAllProductsController);

// GET category products
router.get("/category/:category", getProductCategoryController);

// GET category insights
router.get("/category/:category/insights", getCategoryInsightsController);

// GET product by id
router.get("/:id", getProductIdController);

// Admin only

// Create product
router.post("/", authMiddleware, requireAdmin, createProductController);

// Update price
router.put("/:id", authMiddleware, requireAdmin, updateProductPriceController);

// Delete product
router.delete("/:id", authMiddleware, requireAdmin, removeProductController);

module.exports = router;