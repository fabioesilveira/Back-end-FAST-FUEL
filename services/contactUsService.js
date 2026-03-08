const { findAllContacts } = require("../models/contactUsModel");

async function getAllContactsService(query) {
    const filters = {
        replied: query.replied,
        email: query.email,
        order_code: query.order_code,
    };

    const contacts = await findAllContacts(filters);
    return contacts;
}

module.exports = {
    getAllContactsService,
};