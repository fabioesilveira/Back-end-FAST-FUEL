const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
    return stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
    });
};

const getPaymentIntent = async (paymentIntentId) => {
    return stripe.paymentIntents.retrieve(paymentIntentId);
};

module.exports = {
    createPaymentIntent,
    getPaymentIntent,
};