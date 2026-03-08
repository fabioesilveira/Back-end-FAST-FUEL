const connection = require("../connection");


async function findAllContacts(filters = {}) {
    const { replied, email, order_code } = filters;

    let sql = `
      SELECT 
        id, name, email, order_code, phone, subject, message,
        created_at, replied, replied_at
      FROM contactUs
      WHERE 1=1
    `;

    const params = [];

    if (replied !== undefined) {
        sql += " AND replied = ?";
        params.push(Number(replied) ? 1 : 0);
    }

    if (email) {
        sql += " AND email LIKE ?";
        params.push(`%${email}%`);
    }

    if (order_code) {
        sql += " AND order_code = ?";
        params.push(String(order_code));
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(sql, params);
    return rows;
}


async function findContactById(id) {
    const [rows] = await connection.execute(
        `
        SELECT 
          id, name, email, order_code, phone, subject, message,
          created_at, replied, replied_at
        FROM contactUs
        WHERE id = ?
        `,
        [id]
    );

    return rows;
}


async function findSaleByOrderCode(orderCode) {
    const [rows] = await connection.execute(
        "SELECT 1 FROM sales WHERE order_code = ? LIMIT 1",
        [orderCode]
    );

    return rows;
}


async function createContact(name, email, orderCode, phone, subject, message) {
    const [result] = await connection.execute(
        `
        INSERT INTO contactUs (name, email, order_code, phone, subject, message)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [name, email, orderCode, phone, subject, message]
    );

    return result;
}


async function markContactAsReplied(id) {
    const [result] = await connection.execute(
        `
        UPDATE contactUs
        SET replied = 1,
            replied_at = NOW()
        WHERE id = ?
        `,
        [id]
    );

    return result;
}

module.exports = {
    findAllContacts,
    findContactById,
    findSaleByOrderCode,
    createContact,
    markContactAsReplied,
};