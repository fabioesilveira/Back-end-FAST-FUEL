const express = require("express");
const connection = require("../connection");
const {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
  updateProductPriceController
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


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const [result] = await connection.execute(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ msg: "cannot find" });
  }

  return res.json({ msg: "deleted", affectedRows: result.affectedRows });
});

module.exports = router;
