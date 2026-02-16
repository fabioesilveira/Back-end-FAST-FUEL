const { postUserService, postUserLoginService, } = require("../services/userService");

async function postUserLoginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await postUserLoginService(email, password);

        console.log(user)

        return res.status(200).json(user);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Login failed" });
    }
}

async function postUserController(req, res) {
    try {
        const { fullName, phone, email, password } = req.body;

        if (!fullName || !phone || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const data = await postUserService(fullName, phone, email, password)

        return res.status(201).json({
            id: data.insertId,
            userName: data.fullName,
            email: data.email,
            type: "normal",
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { postUserController, postUserLoginController }