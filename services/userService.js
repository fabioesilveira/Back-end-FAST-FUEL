const { findUserByEmail, createNewUser } = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

async function postUserLoginService(email, password) {
    const rows = await findUserByEmail(email);
    const user = rows[0];

    if (!user) return { msg: "User not found" };

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok) return { msg: "Invalid Password" };

    const payload = { id: user.id, email: user.email, fullName: user.fullName, type: user.type };
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


module.exports = { postUserService, postUserLoginService }