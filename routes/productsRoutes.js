const express = require("express");
const connection = require("../connection");
const { getProductIdController, getProductCategoryController } = require("../controllers/productsControllers.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const [result] = await connection.execute("SELECT * FROM products");
  return res.json(result);
});

router.get("/:id", getProductIdController);
router.get("/category/:category",getProductCategoryController);

router.post("/", async (req, res) => {
  const { name, price, category } = req.body;

  const [result] = await connection.execute(
    `INSERT INTO products (name, price, category)
    VALUES (?, ?, ?)`,
    [name, price, category]
  );

  return res.json(result);
});

router.put("/:id", async (req, res) => {
  const { price } = req.body;
  const { id } = req.params;

  const [result] = await connection.execute(
    `UPDATE products SET price = ? WHERE id = ?`,
    [price, id]
  );

  return res.json(result);
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const [result] = await connection.execute(
    `DELETE FROM products where id = ${id}`
  );
  return res.json(result);
});

module.exports = router;