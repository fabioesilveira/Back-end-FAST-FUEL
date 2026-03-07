const { normalizeEmail } = require("../utils/normalize");
const {
    postUserService,
    postUserLoginService,
    getAdminUsersService,
    getNormalUsersService,
    getUserByIdService,
} = require("../services/userService");


async function getAdminUsersController(req, res) {
    try {
        const users = await getAdminUsersService();
        return res.status(200).json(users);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load users" });
    }
}

async function getNormalUsersController(req, res) {
    try {
        const users = await getNormalUsersService();
        return res.status(200).json(users);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load users" });
    }
}

async function postUserLoginController(req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        email = normalizeEmail(email);

        const user = await postUserLoginService(email, password);

        if (user?.msg === "User not found" || user?.msg === "Invalid Password") {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        if (user?.msg) {
            return res.status(400).json(user);
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

        if (data?.msg === "User already exists") {
            return res.status(409).json({ msg: "This email is already in use" });
        }

        if (data?.msg) {
            return res.status(400).json(data);
        }

        return res.status(201).json({
            id: data.insertId,
            fullName,
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

async function getUserByIdController(req, res) {
    try {
        const { id } = req.params;

        const data = await getUserByIdService(id, req.user);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load user" });
    }
}

module.exports = {
    postUserController,
    postUserLoginController,
    getAdminUsersController,
    getNormalUsersController,
    getUserByIdController,
};
