const { postUserService, postUserLoginService } = require("../services/userService");
const { normalizeEmail } = require("../utils/normalize");

async function postUserLoginController(req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        email = normalizeEmail(email);

        const user = await postUserLoginService(email, password);

        if (user?.msg) {
            const code =
                user.msg === "User not found" ? 404 :
                    user.msg === "Invalid Password" ? 401 :
                        400;

            return res.status(code).json(user);
        }

        return res.status(200).json(user);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Login failed" });
    }
}

async function postUserController(req, res) {
    try {
        let { fullName, phone, email, password } = req.body;

        if (!fullName || !phone || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        email = normalizeEmail(email);

        const data = await postUserService(fullName, phone, email, password);

        if (data?.msg) {
            return res.status(409).json(data);
        }

        return res.status(201).json({
            id: data.insertId,
            userName: fullName,
            email,
            type: "normal",
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);

        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ msg: "This email is already in use" });
        }

        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { postUserController, postUserLoginController };
