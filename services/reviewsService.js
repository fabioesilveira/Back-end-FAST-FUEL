const connection = require("../connection");
const {
    createReview,
    findReviewBySaleProduct,
    findReviewsByProduct,
    findReviewedProductIdsBySale,
    findReviewsByCategory,
} = require("../models/reviewsModel");


function abbreviateName(name) {
    if (!name) return "Verified Guest";

    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "Verified Guest";
    if (parts.length === 1) return parts[0];

    return `${parts[0]} ${parts[1][0]}.`;
}

function parseJsonField(value, fallback = []) {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    return value;
}

async function createReviewService(payload, loggedUser = null) {
    const { sale_id, product_id, rating, comment, customer_email } = payload;

    if (!sale_id || !product_id || !rating) {
        return { msg: "sale_id, product_id and rating are required", status: 400 };
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return { msg: "rating must be an integer between 1 and 5", status: 400 };
    }

    if (comment && String(comment).length > 500) {
        return { msg: "comment must be at most 500 characters", status: 400 };
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

    let user_id = null;
    let guest_email = null;
    let display_name = "Verified Guest";

    if (loggedUser) {
        if (String(sale.user_id) !== String(loggedUser.id)) {
            return { msg: "Not allowed", status: 403 };
        }

        user_id = loggedUser.id;
        display_name = abbreviateName(loggedUser.fullName);
    } else {
        if (!customer_email) {
            return { msg: "customer_email is required for guest review", status: 400 };
        }

        if (
            String(customer_email).trim().toLowerCase() !==
            String(sale.customer_email || "").trim().toLowerCase()
        ) {
            return { msg: "Invalid email", status: 403 };
        }

        guest_email = String(customer_email).trim().toLowerCase();
        display_name = abbreviateName(sale.customer_name);
    }

    const itemsSnapshot = parseJsonField(sale.items_snapshot, []);

    const productExists = itemsSnapshot.some(
        (item) => String(item.id) === String(product_id)
    );

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
        rating: ratingNum,
        comment: comment ? String(comment).trim() : null,
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
        rows.reduce((sum, row) => sum + Number(row.rating || 0), 0) / rows.length;

    return {
        reviews: rows,
        average_rating: Number(avg.toFixed(2)),
        count: rows.length,
    };
}

async function getEligibleReviewsService(query, loggedUser = null) {
    const { sale_id, customer_email } = query;

    if (!sale_id) {
        return { msg: "sale_id is required", status: 400 };
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

    if (loggedUser) {
        if (String(sale.user_id) !== String(loggedUser.id)) {
            return { msg: "Not allowed", status: 403 };
        }
    } else {
        if (!customer_email) {
            return { msg: "customer_email is required for guest", status: 400 };
        }

        if (
            String(customer_email).trim().toLowerCase() !==
            String(sale.customer_email || "").trim().toLowerCase()
        ) {
            return { msg: "Invalid email", status: 403 };
        }
    }

    const itemsSnapshot = parseJsonField(sale.items_snapshot, []);
    const reviewedRows = await findReviewedProductIdsBySale(sale_id);
    const reviewedIds = new Set(reviewedRows.map((r) => String(r.product_id)));

    const uniqueItems = [];
    const seen = new Set();

    for (const item of itemsSnapshot) {
        const id = String(item.id);

        if (seen.has(id)) continue;
        seen.add(id);

        if (reviewedIds.has(id)) continue;

        uniqueItems.push({
            sale_id: Number(sale_id),
            product_id: Number(item.id),
            name: item.name,
            image: item.image,
            category: item.category,
            qty: item.qty,
        });
    }

    return {
        sale_id: Number(sale_id),
        eligible_items: uniqueItems,
        count: uniqueItems.length,
    };
}

async function getReviewsByCategoryService(category) {
    const validCategories = new Set([
        "sandwiches",
        "sides",
        "beverages",
        "desserts",
    ]);

    const cat = String(category || "").trim().toLowerCase();

    if (!validCategories.has(cat)) {
        return { msg: "Invalid category", status: 400 };
    }

    const rows = await findReviewsByCategory(cat);

    return {
        category: cat,
        reviews: rows,
        count: rows.length,
    };
}

module.exports = {
    createReviewService,
    getReviewsByProductService,
    getEligibleReviewsService,
    getReviewsByCategoryService,
};