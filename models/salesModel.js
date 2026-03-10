const connection = require("../connection");

async function findAllSales(filters = {}) {
    const { statusList, user_id, order_code, email } = filters;

    let sql = "SELECT * FROM sales WHERE 1=1";
    const params = [];

    if (statusList && statusList.length > 0) {
        if (statusList.length === 1) {
            sql += " AND status = ?";
            params.push(statusList[0]);
        } else {
            sql += ` AND status IN (${statusList.map(() => "?").join(",")})`;
            params.push(...statusList);
        }
    }

    if (user_id) {
        sql += " AND user_id = ?";
        params.push(user_id);
    }

    if (order_code) {
        sql += " AND order_code LIKE ?";
        params.push(`%${String(order_code).trim()}%`);
    }

    if (email) {
        sql += " AND customer_email LIKE ?";
        params.push(`%${String(email).trim()}%`);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(sql, params);
    return rows;
}

async function findSaleById(id) {
    const [rows] = await connection.execute(
        "SELECT * FROM sales WHERE id = ?",
        [id]
    );

    return rows;
}


module.exports = {
  findAllSales,
  findSaleById,
};