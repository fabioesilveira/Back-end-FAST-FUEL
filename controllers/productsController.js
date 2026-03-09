const {
  getAllProductsService,
  getProductsIdService,
  getProductsCategoryService,
} = require("../services/productsService");


async function getAllProductsController(req, res) {
  try {
    const products = await getAllProductsService();
    return res.status(200).json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load products" });
  }
}

// GET /products/:id
async function getProductIdController(req, res) {
  try {
    const { id } = req.params;

    const result = await getProductsIdService(id);

    if (result.msg) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// GET /products/category/:category
async function getProductCategoryController(req, res) {
  try {
    const { category } = req.params;

    const result = await getProductsCategoryService(category);

    if (result.msg) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("GET PRODUCT BY CATEGORY ERROR:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
};
