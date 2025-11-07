const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.get("/admin", async (req, res) => {
    const [result] = await connection.execute("SELECT * FROM users");
    return res.json(result);
});

router.get("/", async (req, res) => {
    const [result] = await connection.execute(
        "SELECT id, fullName, phone, email FROM users WHERE type = 'normal'"
    );
    return res.json(result);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const [result] = await connection.execute(
        `SELECT id, fullName, phone, email FROM users WHERE id = ${id}`
    );

    if (result.length === 0) {
        return res.json({ msg: "cannot find" });
    }
    return res.json(result);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [result] = await connection.execute(
        `SELECT * from users where email = ?`,
        [email]
    );

    if (result[0]) {
        if (result[0].password === password) {
            const data = {
                userName: result[0].fullName,
                email: result[0].email,
                type: result[0].type,
                id: result[0].id
            }
            return res.json(data);
        }


        return res.json("YOUR PASSWORD DOES NOT MATCH WITH THE ACCOUNT");
    }

    return res.json("NOT FOUND")
});

router.put("/:id", async (req, res) => {
    const { senha } = req.body;
    const { id } = req.params;

    const [result] = await connection.execute(
        `UPDATE users SET senha = ? WHERE id = ?`,
        [senha, id]
    );

    return res.json(result);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const [result] = await connection.execute(
        `DELETE FROM users where id = ${id}`
    );
    return res.json(result);
});

module.exports = router;