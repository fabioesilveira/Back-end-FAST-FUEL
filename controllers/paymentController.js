const { createPaymentIntent } = require("../services/paymentService");
const { calcTotalsFromDb } = require("../services/salesService");
const { normalizeItems } = require("../utils/sales");

const createIntent = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items) {
            return res.status(400).json({
                message: "items is required",
            });
        }

        const itemsNorm = normalizeItems(items);

        if (!itemsNorm) {
            return res.status(400).json({
                message: "items must be an array",
            });
        }

        if (itemsNorm.length === 0) {
            return res.status(400).json({
                message: "items cannot be empty",
            });
        }

        const breakdown = await calcTotalsFromDb(itemsNorm);

        const paymentIntent = await createPaymentIntent(
            breakdown.total
        );

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: breakdown.total,
        });
    } catch (error) {
        console.error("Stripe payment error:", error);

        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to create payment intent",
        });
    }
};

module.exports = {
    createIntent,
};