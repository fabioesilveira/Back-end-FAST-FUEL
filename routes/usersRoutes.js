const express = require("express");
const connection = require("../connection");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");
const bcryptjs = require("bcryptjs");
const {
    postUserController,
    postUserLoginController,
    getAdminUsersController,
    getNormalUsersController,
    getUserByIdController,
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

// Update password
router.get("/:id", authMiddleware, getUserByIdController);

// Delete own account (logado)
router.delete("/removeUser", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [userId]);

        if (!result.affectedRows) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.json({ affectedRows: result.affectedRows, msg: "User deleted" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to remove user" });
    }
});

// Get user by id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const isSelf = String(req.user.id) === String(id);
        const isAdmin = req.user.type === "admin";

        if (!isSelf && !isAdmin) {
            return res.status(403).json({ msg: "Sem permissão" });
        }

        const [result] = await connection.execute(
            "SELECT id, fullName, phone, email, type, created_at FROM users WHERE id = ?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ msg: "cannot find" });
        }

        return res.json(result[0]);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load user" });
    }
});

module.exports = router;
