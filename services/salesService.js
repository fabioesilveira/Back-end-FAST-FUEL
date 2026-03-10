const { findAllSales, findSaleById } = require("../models/salesModel");
const { parseSaleRow } = require("../utils/sales");

const VALID_STATUS = new Set(["received", "in_progress", "sent", "completed"]);

async function getAllSalesService(query) {
    const { status, user_id, order_code, email } = query;

    let statusList = [];

    if (status) {
        const raw = String(status).trim();
        const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);

        for (const s of parts) {
            if (!VALID_STATUS.has(s)) {
                return { msg: `Invalid status: ${s}`, status: 400 };
            }
        }

        statusList = parts;
    }

    const rows = await findAllSales({
        statusList,
        user_id,
        order_code,
        email,
    });

    return rows.map(parseSaleRow);
}

async function getSaleByIdService(id) {
    const rows = await findSaleById(id);

    if (!rows || rows.length === 0) {
        return { msg: "Sale not found", status: 404 };
    }

    return parseSaleRow(rows[0]);
}


module.exports = {
    getAllSalesService,
    getSaleByIdService,
};