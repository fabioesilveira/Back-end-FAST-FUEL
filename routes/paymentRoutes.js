const express = require("express");
const router = express.Router();

const {
    createIntent,
} = require("../controllers/paymentController");

router.post("/create-intent", createIntent);

module.exports = router;