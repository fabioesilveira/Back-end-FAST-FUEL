const {
    getAllSalesService,
    getSaleByIdService,
    quoteSalesService,
    createSaleService,
    updateSaleStatusService,
    confirmSaleReceivedService,
    trackSaleService,
    getMyOrdersService,
} = require("../services/salesService");

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

async function trackSaleController(req, res) {
    try {
        const data = await trackSaleService(req.body);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("trackSaleController error:", error);
        return res.status(500).json({
            msg: error.message || "Internal server error",
        });
    }
}

async function getMyOrdersController(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const data = await getMyOrdersService(userId, req.query);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("getMyOrdersController error:", error);
        return res.status(500).json({ msg: error.message || "Internal server error" });
    }
}

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
    quoteSalesController,
    createSaleController,
    trackSaleController,
    getMyOrdersController,
    getAllSalesController,
    getSaleByIdController,
    updateSaleStatusController,
    confirmSaleReceivedController,
};