const express = require("express");
const connection = require("../connection");
const {
  getProductIdController,
  getProductCategoryController,
} = require("../controllers/productsControllers.js");

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const [result] = await connection.execute("SELECT * FROM products");
  return res.json(result);
});

router.get("/category/:category", getProductCategoryController);

// GET by id
router.get("/:id", getProductIdController);


router.post("/", async (req, res) => {
  const { name, price, category, image, description } = req.body;

  if (!name || price === undefined || !category || !image || !description) {
    return res.status(400).json({
      msg: "Missing fields. Required: name, price, category, image, description",
    });
  }

  const [result] = await connection.execute(
    `INSERT INTO products (name, price, category, image, description)
     VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, description]
  );

  return res.status(201).json({
    id: result.insertId,
    name,
    price,
    category,
    image,
    description,
  });
});

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
