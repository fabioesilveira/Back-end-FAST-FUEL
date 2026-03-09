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

module.exports = {
  findAllProducts,
  getProductIdModel,
  getProductCategoryModel,
};
