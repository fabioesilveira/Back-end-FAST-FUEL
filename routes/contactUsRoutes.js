const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, orderNumber, phone, subject, message } = req.body;

    const [result] = await connection.execute(
        `INSERT INTO contactUs (name, email, orderNumber, phone, subject, message)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, orderNumber, phone, subject, message]
    );

    return res.json(result);
});

router.get("/:id", async (req, res) => {
});

module.exports = router;