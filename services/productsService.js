const {
  findAllProducts,
  getProductIdModel,
  getProductCategoryModel,
} = require("../models/productsModel.js");



async function getAllProductsService() {
  const products = await findAllProducts();
  return products;
}

async function getProductsIdService(id) {
  const result = await getProductIdModel(id);

  if (result.length === 0) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  // retorna 1 produto (objeto)
  return result[0];
}

async function getProductsCategoryService(category) {
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
  getAllProductsService,
  getProductsIdService,
  getProductsCategoryService,
};
