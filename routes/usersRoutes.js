const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");
const {
    postUserController,
    postUserLoginController,
    getAdminUsersController,
    getNormalUsersController,
    getUserByIdController,
    removeOwnUserController,
} = require("../controllers/userController");

const router = express.Router();

// Admin list
router.get("/admin", authMiddleware, requireAdmin, getAdminUsersController);

// Normal users list
router.get("/", authMiddleware, requireAdmin, getNormalUsersController);

// Register
router.post("/register", postUserController);

// Login
router.post("/login", postUserLoginController);

// Get user by id
router.get("/:id", authMiddleware, getUserByIdController);

// Delete own account (logged user)
router.delete("/removeUser", authMiddleware, removeOwnUserController);

module.exports = router;