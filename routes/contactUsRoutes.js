const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  markContactAsRepliedController,
} = require("../controllers/contactUsController");

const router = express.Router();

// Public
router.post("/", createContactController);

// Admin only
router.get("/", authMiddleware, requireAdmin, getAllContactsController);
router.patch("/:id/reply", authMiddleware, requireAdmin, markContactAsRepliedController);
router.get("/:id", authMiddleware, requireAdmin, getContactByIdController);

module.exports = router;