const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
    });

    return paymentIntent;
};

module.exports = {
    createPaymentIntent,
};