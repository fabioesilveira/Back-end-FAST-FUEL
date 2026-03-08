const { findAllContacts, findContactById } = require("../models/contactUsModel");

async function getAllContactsService(query) {
    const filters = {
        replied: query.replied,
        email: query.email,
        order_code: query.order_code,
    };

    const contacts = await findAllContacts(filters);
    return contacts;
}

async function getContactByIdService(id) {
    const rows = await findContactById(id);

    if (!rows || rows.length === 0) {
        return { msg: "Contact not found", status: 404 };
    }

    return rows[0];
}

module.exports = {
    getAllContactsService,
    getContactByIdService,
};