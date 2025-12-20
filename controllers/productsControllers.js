const { getProductIdServices, getProductCategoryServices } = require("../services/productServices");


async function getProductIdController(req, res) {
    const { id } = req.params;
    const result = await getProductIdServices(id)
    return res.json(result);
}

async function getProductCategoryController(req, res) {
    const { category } = req.params;
    const result = await getProductCategoryServices(category)
    return res.json(result);
}

module.exports = {
    getProductIdController,
    getProductCategoryController
}