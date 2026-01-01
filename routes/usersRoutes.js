const express = require("express");
const connection = require("../connection");

const router = express.Router();

// ✅ Admin list (sem password)
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

// ✅ Normal users list (sem password)
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

// ✅ Get user by id (sem password)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      "SELECT id, fullName, phone, email, type, created_at FROM users WHERE id = ?",
      [id]
    );

    if (result.length === 0) return res.status(404).json({ msg: "cannot find" });
    return res.json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to load user" });
  }
});

// ✅ Register (padronizado com schema)
router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const [result] = await connection.execute(
      `INSERT INTO users (fullName, phone, email, password, type)
       VALUES (?, ?, ?, ?, 'normal')`,
      [fullName, phone, email, password]
    );

    return res.status(201).json({
      id: result.insertId,
      userName: fullName,
      email,
      type: "normal",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ Login (ok do jeito que você quer)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const [result] = await connection.execute(
      "SELECT id, fullName, email, password, type FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = result[0];

    if (user.password !== password) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    return res.status(200).json({
      id: user.id,
      userName: user.fullName,
      email: user.email,
      type: user.type,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Login failed" });
  }
});

// ✅ Update password
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

// ⚠️ Remove user by email+password (demo ok)
router.delete("/removeUser", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "email and password required" });

    const [result] = await connection.execute(
      "DELETE FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to remove user" });
  }
});

// ✅ Delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Failed to delete user" });
  }
});

module.exports = router;
