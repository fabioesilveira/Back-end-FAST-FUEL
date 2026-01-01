const {
  getProductIdModel,
  getProductCategoryModel,
} = require("../models/productsModels.js");

async function getProductIdServices(id) {
  const result = await getProductIdModel(id);

  if (result.length === 0) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  // retorna 1 produto (objeto)
  return result[0];
}

async function getProductCategoryServices(category) {
  const result = await getProductCategoryModel(category);

  if (result.length === 0) {
    const err = new Error("No products found for this category");
    err.statusCode = 404;
    throw err;
  }

  // retorna lista
  return result;
}

module.exports = {
  getProductIdServices,
  getProductCategoryServices,
};
