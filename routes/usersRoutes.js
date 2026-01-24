const express = require("express");
const connection = require("../connection");
const { postUserController, postUserLoginController } = require("../controllers/userController");

const router = express.Router();

// Admin list (sem password)
router.get("/admin", async (req, res) => {
    try {
        const [result] = await connection.execute(
            "SELECT id, fullName, phone, email, type, created_at FROM users ORDER BY id DESC"
        );
        return res.json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load users" });
    }
});

// Normal users list (sem password)
router.get("/", async (req, res) => {
    try {
        const [result] = await connection.execute(
            "SELECT id, fullName, phone, email, created_at FROM users WHERE type = 'normal' ORDER BY id DESC"
        );
        return res.json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load users" });
    }
});

// Register
router.post("/register", postUserController);

// Login
router.post("/login", postUserLoginController);

// Update password
router.put("/:id", async (req, res) => {
    try {
        const { password } = req.body;
        const { id } = req.params;

        if (!password) return res.status(400).json({ msg: "password is required" });

        const [result] = await connection.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [password, id]
        );

        return res.json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to update password" });
    }
});

// Delete by email + password 
router.delete("/removeUser", async (req, res) => {
    try {
        const email = String(req.body?.email || "").trim().toLowerCase();
        const password = String(req.body?.password || "").trim();

        if (!email || !password) {
            return res.status(400).json({ msg: "email and password required" });
        }

        const [result] = await connection.execute(
            "DELETE FROM users WHERE LOWER(email) = ? AND password = ?",
            [email, password]
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                affectedRows: 0,
                msg: "Email and password do not match any account.",
            });
        }

        return res.json({
            affectedRows: result.affectedRows,
            msg: "User deleted",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to remove user" });
    }
});

// Get user by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

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
