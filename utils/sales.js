function genOrderCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function genPaymentRef() {
    return "SIM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function safeJsonParse(value, fallback) {
    try {
        if (value === null || value === undefined) return fallback;
        if (typeof value === "string") return JSON.parse(value);
        return value;
    } catch {
        return fallback;
    }
}

function normalizeItems(items) {
    let parsed = items;

    if (typeof items === "string") {
        try {
            parsed = JSON.parse(items);
        } catch {
            return null;
        }
    }

    if (!Array.isArray(parsed)) return null;

    const norm = parsed
        .map((it) => {
            const id = it?.id ?? it?.product_id ?? it?.productId;
            const qtyRaw = it?.quantidade ?? it?.quantity ?? it?.qty ?? 1;

            const qty = Math.max(1, Number(qtyRaw) || 1);

            if (id === undefined || id === null) return null;

            return { id: String(id), qty };
        })
        .filter(Boolean);

    return norm;
}

function parseSaleRow(row) {
    return {
        ...row,
        items: safeJsonParse(row.items, []),
        items_snapshot: safeJsonParse(row.items_snapshot, []),
        delivery_address: safeJsonParse(row.delivery_address, null),
    };
}

module.exports = {
    genOrderCode,
    genPaymentRef,
    round2,
    safeJsonParse,
    normalizeItems,
    parseSaleRow,
};