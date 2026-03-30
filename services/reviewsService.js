const connection = require("../connection");
const {
    createReview,
    findReviewBySaleProduct,
    findReviewsByProduct,
} = require("../models/reviewsModel");

function abbreviateName(name) {
    if (!name) return "Verified Guest";

    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];

    return `${parts[0]} ${parts[1][0]}.`;
}

async function createReviewService(payload, loggedUser = null) {
    const { sale_id, product_id, rating, comment, customer_email } = payload;

    if (!sale_id || !product_id || !rating) {
        return { msg: "sale_id, product_id and rating are required", status: 400 };
    }

    if (rating < 1 || rating > 5) {
        return { msg: "rating must be between 1 and 5", status: 400 };
    }

    const [saleRows] = await connection.execute(
        `SELECT * FROM sales WHERE id = ?`,
        [sale_id]
    );

    if (!saleRows.length) {
        return { msg: "Sale not found", status: 404 };
    }

    const sale = saleRows[0];

    if (sale.status !== "completed") {
        return { msg: "Order not completed yet", status: 400 };
    }

    let display_name = "Verified Guest";
    let user_id = null;
    let guest_email = null;

    if (loggedUser) {
        if (String(sale.user_id) !== String(loggedUser.id)) {
            return { msg: "Not allowed", status: 403 };
        }

        user_id = loggedUser.id;
        display_name = abbreviateName(loggedUser.fullName);
    } else {
        if (!customer_email || customer_email !== sale.customer_email) {
            return { msg: "Invalid email", status: 403 };
        }

        guest_email = customer_email;
        display_name = abbreviateName(sale.customer_name);
    }

    const items = JSON.parse(sale.items_snapshot || "[]");

    const productExists = items.some((p) => String(p.id) === String(product_id));

    if (!productExists) {
        return { msg: "Product not in this order", status: 400 };
    }

    const existing = await findReviewBySaleProduct(sale_id, product_id);

    if (existing.length) {
        return { msg: "Review already exists", status: 400 };
    }

    const result = await createReview({
        sale_id,
        product_id,
        user_id,
        guest_email,
        display_name,
        rating,
        comment: comment || null,
    });

    return {
        id: result.insertId,
        msg: "Review created",
    };
}

async function getReviewsByProductService(product_id) {
    const rows = await findReviewsByProduct(product_id);

    if (!rows.length) {
        return {
            reviews: [],
            average_rating: 0,
            count: 0,
        };
    }

    const avg =
        rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;

    return {
        reviews: rows,
        average_rating: Number(avg.toFixed(2)),
        count: rows.length,
    };
}

module.exports = {
    createReviewService,
    getReviewsByProductService,
};