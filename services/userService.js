const { findUserByEmail, createNewUser } = require("../models/userModel");
const bcryptjs = require("bcryptjs");

async function postUserLoginService(email, password) {

    const result = await findUserByEmail(email);

    if (result.length === 0) {
        return { msg: "User not found" };
    }

    const user = result[0];

    console.log(user)

    if (user.password !== password) {
        return { msg: "Invalid password" };
    }
    return user;
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