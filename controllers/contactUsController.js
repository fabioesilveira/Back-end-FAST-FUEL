const {
    getAllContactsService,
    getContactByIdService,
} = require("../services/contactUsService");


async function getAllContactsController(req, res) {
    try {
        const contacts = await getAllContactsService(req.query);
        return res.status(200).json(contacts);
    } catch (err) {
        console.error("CONTACT-US GET ERROR:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


async function getContactByIdController(req, res) {
    try {
        const { id } = req.params;

        const data = await getContactByIdService(id);

        if (data?.msg) {
            return res.status(data.status || 400).json({ msg: data.msg });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error("CONTACT-US GET/:id ERROR:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


module.exports = {
    getAllContactsController,
    getContactByIdController,
};