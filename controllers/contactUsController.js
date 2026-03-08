const { getAllContactsService } = require("../services/contactUsService");

async function getAllContactsController(req, res) {
    try {
        const contacts = await getAllContactsService(req.query);
        return res.status(200).json(contacts);
    } catch (err) {
        console.error("CONTACT-US GET ERROR:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = {
    getAllContactsController,
};