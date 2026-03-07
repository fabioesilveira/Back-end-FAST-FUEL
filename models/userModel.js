const connection = require("../connection");

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

async function findUserByEmail(email) {
    const e = String(email || "").trim().toLowerCase();
    const [rows] = await connection.execute(
        "SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1",
        [e]
    );
    return rows; 
}

async function createNewUser(fullName, phone, email, passwordHash) {
    const e = String(email || "").trim().toLowerCase();

    const [result] = await connection.execute(
        `INSERT INTO users (fullName, phone, email, password, type)
     VALUES (?, ?, ?, ?, 'normal')`,
        [fullName, phone, e, passwordHash]
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

async function deleteUserById(id) {
    const [result] = await connection.execute(
        "DELETE FROM users WHERE id = ?",
        [id]
    );

    return result;
}


module.exports = {
    findUserByEmail,
    createNewUser,
    findAllUsersAdmin,
    findAllNormalUsers,
    findUserById,
    deleteUserById,
};