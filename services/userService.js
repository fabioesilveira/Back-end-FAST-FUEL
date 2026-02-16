const { findUserByEmail, createNewUser } = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

async function postUserLoginService(email, password) {

    const [result] = await findUserByEmail(email);

    if (result.length === 0) {
        return { msg: "User not found" };
    }

    const isPasswordValid = await bcryptjs.compare(password, result.password)

    if (!isPasswordValid) {
        return { msg: "Invalid Password" }
    }

    const payLoad = { email: result.email, id: result.id, fullName: result.fullName }
    const token = generateToken(payLoad)
    payLoad.token = token

    return payLoad;
}

async function postUserService(fullName, phone, email, password) {

    const existing = await findUserByEmail(email)

    if (existing.length > 0) {
        return { msg: "User already exists" };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await createNewUser(fullName, phone, email, hashedPassword);

    return result;
}

module.exports = { postUserService, postUserLoginService }