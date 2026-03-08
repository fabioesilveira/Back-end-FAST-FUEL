function normalizeOrderCode({ order_code, orderNumber }) {
    const raw =
        (order_code != null ? String(order_code).trim() : "") ||
        (orderNumber != null ? String(orderNumber).trim() : "");

    if (!raw || raw === "0") return null;

    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length !== 6) return null;

    return cleaned;
}

module.exports = { normalizeOrderCode };