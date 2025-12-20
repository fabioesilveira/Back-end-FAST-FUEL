const { getProductIdModel, getProductCategoryModel } = require("../models/productsModels.js")

async function getProductIdServices(id) {
    const result = await getProductIdModel(id)

    if (result.length === 0) {
        return { msg: "cannot find" };
    }
    return result
}

async function getProductCategoryServices(category) {
    const result = await getProductCategoryModel(category)

    if (result.length === 0) {
        return { msg: "cannot find" };
    }
    return result
}

module.exports = {
    getProductIdServices,
    getProductCategoryServices
}