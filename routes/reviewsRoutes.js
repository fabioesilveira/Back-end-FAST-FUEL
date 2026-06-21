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

// Eligible reviews
router.get("/eligible", optionalAuth, getEligibleReviewsController);

// Reviews by category
router.get("/category/:category", getReviewsByCategoryController);

// Reviews by product
router.get("/product/:productId", getReviewsByProductController);

// All reviews
router.get("/", getAllReviewsController);

// Create review
router.post("/", optionalAuth, createReviewController);

module.exports = router;