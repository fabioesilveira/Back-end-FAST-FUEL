const express = require("express");
const {
    createReviewController,
    getReviewsByProductController,
    getEligibleReviewsController,
    getReviewsByCategoryController,
    getAllReviewsController,
} = require("../controllers/reviewsController");

const optionalAuth = require("../middlewares/optionalAuth");

const router = express.Router();

router.get("/eligible", optionalAuth, getEligibleReviewsController);
router.get("/category/:category", getReviewsByCategoryController);
router.get("/product/:productId", getReviewsByProductController);
router.get("/", getAllReviewsController);
router.post("/", optionalAuth, createReviewController);

module.exports = router;