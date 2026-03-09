const connection = require("../connection");


async function findAllProducts() {
  const [rows] = await connection.execute("SELECT * FROM products");
  return rows;
}

async function getProductIdModel(id) {
  const [result] = await connection.execute(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  return result;
}

async function getProductCategoryModel(category) {
  const [result] = await connection.execute(
    "SELECT * FROM products WHERE category = ?",
    [category]
  );
  return result;
}

async function createProduct(name, price, category, image, description) {
  const [result] = await connection.execute(
    `INSERT INTO products (name, price, category, image, description)
     VALUES (?, ?, ?, ?, ?)`,
    [name, price, category, image, description]
  );

  return result;
}

async function updateProductPrice(id, price) {
  const [result] = await connection.execute(
    `UPDATE products SET price = ? WHERE id = ?`,
    [price, id]
  );

  return result;
}

module.exports = {
  createProduct,
  findAllProducts,
  getProductIdModel,
  getProductCategoryModel,
  updateProductPrice,
};
