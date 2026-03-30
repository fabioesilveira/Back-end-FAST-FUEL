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

module.exports = {
    createReview,
};