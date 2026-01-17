const { findUserByEmail, createNewUser } = require("../models/userModel");
const bcryptjs = require("bcryptjs");

async function postUserService(fullName, phone, email, password) {

    const existing = await findUserByEmail(email)

    if (existing.length > 0) {
        return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await createNewUser(fullName, phone, email, hashedPassword);

    return result;
}

module.exports = { postUserService }