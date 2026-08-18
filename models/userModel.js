const connection = require("../connection");

async function createNewUser(fullName, phone, email, passwordHash) {
    const e = String(email || "").trim().toLowerCase();

    const [result] = await connection.execute(
        `INSERT INTO users (fullName, phone, email, password, type)
         VALUES (?, ?, ?, ?, 'normal')`,
        [fullName, phone, e, passwordHash]
    );

    return result;
}

async function findUserByEmail(email) {
    const e = String(email || "").trim().toLowerCase();

    const [rows] = await connection.execute(
        "SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1",
        [e]
    );

    return rows;
}

async function findAllUsersAdmin() {
    const [rows] = await connection.execute(
        "SELECT id, fullName, phone, email, type, created_at FROM users ORDER BY id DESC"
    );

    return rows;
}

async function findAllNormalUsers() {
    const [rows] = await connection.execute(
        "SELECT id, fullName, phone, email, created_at FROM users WHERE type = 'normal' ORDER BY id DESC"
    );

    return rows;
}

async function deleteUserById(id) {
    const [result] = await connection.execute(
        "DELETE FROM users WHERE id = ?",
        [id]
    );

    return result;
}

async function updateUserPassword(id, passwordHash) {
    const [result] = await connection.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [passwordHash, id]
    );

    return result;
}

async function findUserById(id) {
    const [rows] = await connection.execute(
        "SELECT id, fullName, phone, email, type, created_at FROM users WHERE id = ?",
        [id]
    );

    return rows;
}

async function setEmailVerificationToken(userId, tokenHash, expiresAt) {
    const [result] = await connection.execute(
        `UPDATE users
         SET email_verification_token = ?,
             email_verification_expires = ?
         WHERE id = ?`,
        [tokenHash, expiresAt, userId]
    );

    return result;
}

async function findUserByVerificationToken(tokenHash) {
    const [rows] = await connection.execute(
        `SELECT *
         FROM users
         WHERE email_verification_token = ?
           AND email_verification_expires > NOW()
         LIMIT 1`,
        [tokenHash]
    );

    return rows;
}

async function verifyUserEmail(userId) {
    const [result] = await connection.execute(
        `UPDATE users
         SET email_verified = 1,
             email_verification_token = NULL,
             email_verification_expires = NULL
         WHERE id = ?`,
        [userId]
    );

    return result;
}

async function setPasswordResetToken(userId, tokenHash, expiresAt) {
    const [result] = await connection.execute(
        `UPDATE users
         SET password_reset_token = ?,
             password_reset_expires = ?
         WHERE id = ?`,
        [tokenHash, expiresAt, userId]
    );

    return result;
}

async function findUserByPasswordResetToken(tokenHash) {
    const [rows] = await connection.execute(
        `SELECT *
         FROM users
         WHERE password_reset_token = ?
           AND password_reset_expires > NOW()
         LIMIT 1`,
        [tokenHash]
    );

    return rows;
}

async function clearPasswordResetToken(userId) {
    const [result] = await connection.execute(
        `UPDATE users
         SET password_reset_token = NULL,
             password_reset_expires = NULL
         WHERE id = ?`,
        [userId]
    );

    return result;
}

module.exports = {
    createNewUser,
    findUserByEmail,
    findAllUsersAdmin,
    findAllNormalUsers,
    deleteUserById,
    updateUserPassword,
    findUserById,

    setEmailVerificationToken,
    findUserByVerificationToken,
    verifyUserEmail,

    setPasswordResetToken,
    findUserByPasswordResetToken,
    clearPasswordResetToken,
};