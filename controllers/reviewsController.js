const {
    createReviewService,
    getReviewsByProductService,
} = require("../services/reviewsService");

async function createReviewController(req, res) {
    try {
        const user = req.user || null;

        const data = await createReviewService(req.body, user);

        if (data?.msg && data.status) {
            return res.status(data.status).json({ msg: data.msg });
        }

        return res.status(201).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to create review" });
    }
}

async function getReviewsByProductController(req, res) {
    try {
        const { productId } = req.params;

        const data = await getReviewsByProductService(productId);

        return res.json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load reviews" });
    }
}

module.exports = {
    createReviewController,
    getReviewsByProductController,
};