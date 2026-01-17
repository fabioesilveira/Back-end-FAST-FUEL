const connection = require("../connection");

async function findUserByEmail(email) {

    const [existing] = await connection.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    return existing

}

async function createNewUser(fullName, phone, email, password) {
    const [result] = await connection.execute(
        `INSERT INTO users (fullName, phone, email, password, type)
       VALUES (?, ?, ?, ?, 'normal')`,
        [fullName, phone, email, password]
    );
    return result
}

module.exports = { findUserByEmail, createNewUser }