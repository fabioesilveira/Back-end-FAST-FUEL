const connection = require("../connection");

 async function getProductIdModel(id) {
    const [result] = await connection.execute(
    `SELECT * FROM products where id = ?`, [id]
  );
  return result
}

 async function getProductCategoryModel(category) {
   const [result] = await connection.execute(
    `SELECT * FROM products where category = ?`, [category]
  );
  return result
}

module.exports = {
    getProductIdModel,
    getProductCategoryModel

}

