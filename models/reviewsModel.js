const connection = require("../connection");

async function createReview(data) {
    const {
        sale_id,
        product_id,
        user_id,
        guest_email,
        display_name,
        rating,
        comment,
    } = data;

    const [result] = await connection.execute(
        `INSERT INTO product_reviews 
    (sale_id, product_id, user_id, guest_email, display_name, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sale_id, product_id, user_id, guest_email, display_name, rating, comment]
    );

    return result;
}

async function findReviewBySaleProduct(sale_id, product_id) {
    const [rows] = await connection.execute(
        `SELECT id FROM product_reviews 
     WHERE sale_id = ? AND product_id = ? LIMIT 1`,
        [sale_id, product_id]
    );

    return rows;
}

async function findReviewsByProduct(product_id) {
    const [rows] = await connection.execute(
        `SELECT display_name, rating, comment, created_at
     FROM product_reviews
     WHERE product_id = ?
     ORDER BY created_at DESC`,
        [product_id]
    );

    return rows;
}

async function createReview(data) {
    const {
        sale_id,
        product_id,
        user_id,
        guest_email,
        display_name,
        rating,
        comment,
    } = data;

    const [result] = await connection.execute(
        `INSERT INTO product_reviews
     (sale_id, product_id, user_id, guest_email, display_name, rating, comment)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sale_id, product_id, user_id, guest_email, display_name, rating, comment]
    );

    return result;
}

async function findReviewBySaleProduct(sale_id, product_id) {
    const [rows] = await connection.execute(
        `SELECT id
     FROM product_reviews
     WHERE sale_id = ? AND product_id = ?
     LIMIT 1`,
        [sale_id, product_id]
    );

    return rows;
}

async function findReviewsByProduct(product_id) {
    const [rows] = await connection.execute(
        `SELECT display_name, rating, comment, created_at
     FROM product_reviews
     WHERE product_id = ?
     ORDER BY created_at DESC`,
        [product_id]
    );

    return rows;
}

async function findReviewedProductIdsBySale(sale_id) {
    const [rows] = await connection.execute(
        `SELECT product_id
     FROM product_reviews
     WHERE sale_id = ?`,
        [sale_id]
    );

    return rows;
}

async function findReviewsByCategory(category) {
    const [rows] = await connection.execute(
        `SELECT
        pr.id,
        pr.product_id,
        p.name AS product_name,
        p.image AS product_image,
        p.category,
        pr.display_name,
        pr.rating,
        pr.comment,
        pr.created_at
     FROM product_reviews pr
     INNER JOIN products p ON p.id = pr.product_id
     WHERE p.category = ?
     ORDER BY pr.created_at DESC`,
        [category]
    );

    return rows;
}

module.exports = {
    createReview,
    findReviewBySaleProduct,
    findReviewsByProduct,
    findReviewedProductIdsBySale,
    findReviewsByCategory,
};