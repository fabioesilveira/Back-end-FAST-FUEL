const {
  getAllProductsService,
  getProductsIdService,
  getProductsCategoryService,
  createProductService,
  updateProductPriceService,
  removeProductService
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

    if (result?.msg) {
      return res.status(result.status || 400).json({ msg: result.msg });
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

    if (result?.msg) {
      return res.status(result.status || 400).json({ msg: result.msg });
    }

    return res.json(result);
  } catch (error) {
    console.error("GET PRODUCT BY CATEGORY ERROR:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}


async function createProductController(req, res) {
  try {
    const data = await createProductService(req.body);

    if (data?.msg) {
      return res.status(data.status || 400).json({ msg: data.msg });
    }

    return res.status(201).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to create product" });
  }
}

async function updateProductPriceController(req, res) {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const data = await updateProductPriceService(id, price);

    if (data?.msg && data.status) {
      return res.status(data.status).json({ msg: data.msg });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to update product" });
  }
}

async function removeProductController(req, res) {
  try {
    const { id } = req.params;

    const data = await removeProductService(id);

    if (data?.msg && data.status) {
      return res.status(data.status).json({ msg: data.msg });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to delete product" });
  }
}


module.exports = {
  getAllProductsController,
  getProductIdController,
  getProductCategoryController,
  createProductController,
  updateProductPriceController,
  removeProductController
};
