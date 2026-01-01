const {
  getProductIdServices,
  getProductCategoryServices,
} = require("../services/productServices");

// GET /products/:id
async function getProductIdController(req, res) {
  try {
    const { id } = req.params;

    const result = await getProductIdServices(id);

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

    const result = await getProductCategoryServices(category);

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
  getProductIdController,
  getProductCategoryController,
};
