const {
  findAllProducts,
  getProductIdModel,
  getProductCategoryModel,
  createProduct,
  updateProductPrice,
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


async function createProductService(data) {
  const { name, price, category, image, description } = data;

  if (!name || price === undefined || !category || !image || !description) {
    return {
      msg: "Missing fields. Required: name, price, category, image, description",
      status: 400,
    };
  }

  const result = await createProduct(name, price, category, image, description);

  return {
    id: result.insertId,
    name,
    price,
    category,
    image,
    description,
  };
}

async function updateProductPriceService(id, price) {
  if (price === undefined) {
    return { msg: "price is required", status: 400 };
  }

  const result = await updateProductPrice(id, price);

  if (!result.affectedRows) {
    return { msg: "Product not found", status: 404 };
  }

  return { msg: "updated", affectedRows: result.affectedRows };
}

module.exports = {
  createProductService,
  getAllProductsService,
  getProductsIdService,
  getProductsCategoryService,
  updateProductPriceService,
};
