const { getAllSalesService } = require("../services/salesService");

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

module.exports = {
    getAllSalesController,
};