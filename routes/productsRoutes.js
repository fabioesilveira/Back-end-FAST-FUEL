const express = require("express");
const connection = require("../connection");
const {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
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
router.put("/:id", async (req, res) => {
  const { price } = req.body;
  const { id } = req.params;

  if (price === undefined) {
    return res.status(400).json({ msg: "price is required" });
  }

  const [result] = await connection.execute(
    `UPDATE products SET price = ? WHERE id = ?`,
    [price, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ msg: "cannot find" });
  }

  return res.json({ msg: "updated", affectedRows: result.affectedRows });
});


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
