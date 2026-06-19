const connection = require("../connection");

async function findProductsForTotalsByIds(ids) {
    const [rows] = await connection.execute(
        `SELECT id, price, category
         FROM products
         WHERE id IN (${ids.map(() => "?").join(",")})`,
        ids
    );

    return rows;
}

async function findProductsForSnapshotByIds(ids) {
    const [rows] = await connection.execute(
        `SELECT id, name, price, category, image
         FROM products
         WHERE id IN (${ids.map(() => "?").join(",")})`,
        ids
    );

    return rows;
}

async function createSale(data) {
    const [result] = await connection.execute(
        `INSERT INTO sales (
            order_code, user_id, customer_name, customer_email, delivery_address,
            payment_method, payment_status, payment_ref,
            items, items_snapshot,
            subtotal, discount, tax, delivery_fee, total,
            tax_rate, delivery_fee_base, free_delivery_threshold,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received')`,
        [
            data.order_code,
            data.user_id,
            data.customer_name,
            data.customer_email,
            data.delivery_address,
            data.payment_method,
            data.payment_status,
            data.payment_ref,
            data.items,
            data.items_snapshot,
            data.subtotal,
            data.discount,
            data.tax,
            data.delivery_fee,
            data.total,
            data.tax_rate,
            data.delivery_fee_base,
            data.free_delivery_threshold,
        ]
    );

    return result;
}

async function findSaleByOrderCode(orderCode) {
    const [rows] = await connection.execute(
        "SELECT id FROM sales WHERE order_code = ? LIMIT 1",
        [orderCode]
    );

    return rows;
}

async function trackSaleByCodeAndEmail(orderCode, email) {
    const [rows] = await connection.execute(
        `SELECT *
         FROM sales
         WHERE TRIM(order_code) = ?
           AND LOWER(TRIM(customer_email)) = ?
         LIMIT 1`,
        [orderCode, email]
    );

    return rows;
}

async function findMyOrders(filters = {}) {
    const { userId, statusList, order_code } = filters;

    let sql = `
        SELECT *
        FROM sales
        WHERE user_id = ?
    `;

    const params = [userId];

    if (statusList && statusList.length > 0) {
        sql += ` AND status IN (${statusList.map(() => "?").join(",")})`;
        params.push(...statusList);
    }

    if (order_code) {
        sql += " AND order_code = ?";
        params.push(String(order_code).trim());
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(sql, params);

    return rows;
}

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

async function findSaleStatusById(id) {
    const [rows] = await connection.execute(
        "SELECT status FROM sales WHERE id = ?",
        [id]
    );

    return rows;
}

async function markSaleInProgress(id) {
    const [result] = await connection.execute(
        `UPDATE sales
         SET status = 'in_progress', accepted_at = NOW()
         WHERE id = ?`,
        [id]
    );

    return result;
}

async function markSaleSent(id) {
    const [result] = await connection.execute(
        `UPDATE sales
         SET status = 'sent', sent_at = NOW()
         WHERE id = ?`,
        [id]
    );

    return result;
}

async function markSaleCompleted(id) {
    const [result] = await connection.execute(
        `UPDATE sales
         SET status = 'completed', received_confirmed_at = NOW()
         WHERE id = ?`,
        [id]
    );

    return result;
}

module.exports = {
    findProductsForTotalsByIds,
    findProductsForSnapshotByIds,
    createSale,
    findSaleByOrderCode,
    trackSaleByCodeAndEmail,
    findMyOrders,
    findAllSales,
    findSaleById,
    findSaleStatusById,
    markSaleInProgress,
    markSaleSent,
    markSaleCompleted,
};