const express = require("express");
const {
    createReviewController,
    getReviewsByProductController,
} = require("../controllers/reviewsController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// create review (logado ou guest)
router.post("/", authMiddleware, createReviewController);

// listar reviews por produto
router.get("/product/:productId", getReviewsByProductController);

module.exports = router;