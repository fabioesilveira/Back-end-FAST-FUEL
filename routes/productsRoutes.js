const express = require("express");
const connection = require("../connection");
const {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
  updateProductPriceController,
  removeProductController,
} = require("../controllers/productsController.js");

const router = express.Router();

// GET all
router.get("/", getAllProductsController);

// GET by category
router.get("/category/:category", getProductCategoryController);

// GET by id
router.get("/:id", getProductIdController);

// POST
router.post("/", createProductController);

// PUT (price update)
router.put("/:id", updateProductPriceController);

// DELETE
router.delete("/:id", removeProductController);

module.exports = router;
