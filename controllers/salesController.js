const {
    getAllSalesService,
    getSaleByIdService,
    quoteSalesService,
    createSaleService,
    updateSaleStatusService,
    confirmSaleReceivedService,
} = require("../services/salesService");

async function getAllSalesController(req, res) {
    try {
        const data = await getAllSalesService(req.query);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load sales" });
    }
}

async function getSaleByIdController(req, res) {
    try {
        const { id } = req.params;

        const data = await getSaleByIdService(id);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to load sale" });
    }
}

async function quoteSalesController(req, res) {
    try {
        const { items } = req.body;

        const data = await quoteSalesService(items);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        const status = e.statusCode || 500;
        return res.status(status).json({ msg: e.message || "Failed to quote totals" });
    }
}

async function createSaleController(req, res) {
    try {
        const data = await createSaleService(req.body);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(201).json(data);
    } catch (e) {
        console.error(e);
        const status = e.statusCode || 500;
        return res.status(status).json({ msg: e.message || "Failed to create sale" });
    }
}

const trackSaleController = async (req, res) => {
    try {
        const { order_code, email } = req.body;

        if (!order_code || !email) {
            return res.status(400).json({
                msg: "order_code and email are required",
            });
        }

        const sql = `
      SELECT *
      FROM sales
      WHERE order_code = ? AND customer_email = ?
      LIMIT 1
    `;

        const [rows] = await connection.promise().query(sql, [
            order_code,
            email,
        ]);

        if (!rows.length) {
            return res.status(404).json({
                msg: "Order not found",
            });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("trackSaleController error:", error);
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
};

async function updateSaleStatusController(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await updateSaleStatusService(id, status);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to update status" });
    }
}

async function confirmSaleReceivedController(req, res) {
    try {
        const { id } = req.params;

        const data = await confirmSaleReceivedService(id);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Failed to confirm received" });
    }
}

module.exports = {
    getAllSalesController,
    getSaleByIdController,
    quoteSalesController,
    createSaleController,
    updateSaleStatusController,
    confirmSaleReceivedController,
    trackSaleController,
};