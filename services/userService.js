const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const {
    findUserByEmail,
    createNewUser,
    findAllUsersAdmin,
    findAllNormalUsers,
    findUserById,
} = require("../models/userModel");

async function getAdminUsersService() {
    const users = await findAllUsersAdmin();
    return users;
}

async function getNormalUsersService() {
    const users = await findAllNormalUsers();
    return users;
}

async function postUserLoginService(email, password) {
    const e = String(email || "").trim().toLowerCase();

    const rows = await findUserByEmail(e);
    const user = rows[0];

    if (!user) return { msg: "User not found" };

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) return { msg: "Invalid Password" };

    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: user.type || "customer", // fallback
    };

    const token = generateToken(payload);

    return { ...payload, token };
}


async function postUserService(fullName, phone, email, password) {
    const e = String(email || "").trim().toLowerCase();

    const existing = await findUserByEmail(e);
    if (existing.length > 0) return { msg: "User already exists" };

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await createNewUser(fullName, phone, e, hashedPassword);
    return result;
}

async function getUserByIdService(requestedId, loggedUser) {
    const isSelf = String(loggedUser.id) === String(requestedId);
    const isAdmin = loggedUser.type === "admin";

    if (!isSelf && !isAdmin) {
        return { msg: "Sem permissão", status: 403 };
    }

    const rows = await findUserById(requestedId);

    if (!rows || rows.length === 0) {
        return { msg: "cannot find", status: 404 };
    }

    return rows[0];
}

module.exports = {
    postUserService,
    postUserLoginService,
    getAdminUsersService,
    getNormalUsersService,
    getUserByIdService,
};