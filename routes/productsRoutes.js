const express = require("express");
const {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
  updateProductPriceController,
  removeProductController,
} = require("../controllers/productsController.js");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

// GET all
router.get("/", getAllProductsController);

// GET by category
router.get("/category/:category", getProductCategoryController);

// GET by id
router.get("/:id", getProductIdController);

// POST
router.post("/", authMiddleware, requireAdmin, createProductController);

// PUT (price update)
router.put("/:id", authMiddleware, requireAdmin, updateProductPriceController);

// DELETE
router.delete("/:id", authMiddleware, requireAdmin, removeProductController);

module.exports = router;
