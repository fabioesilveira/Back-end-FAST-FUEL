const {
    findAllContacts,
    findContactById,
    findSaleByOrderCode,
    createContact,
} = require("../models/contactUsModel");

const { normalizeOrderCode } = require("../utils/normalizeOrderCode");

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


async function createContactService(data) {
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !subject || !message) {
        return { msg: "name, email, subject, message are required", status: 400 };
    }

    const safeOrderCode = normalizeOrderCode(data);

    let finalOrderCode = safeOrderCode;

    if (finalOrderCode) {
        const exists = await findSaleByOrderCode(finalOrderCode);

        if (!exists || exists.length === 0) {
            finalOrderCode = null;
        }
    }

    const result = await createContact(
        name,
        email,
        finalOrderCode,
        phone ?? null,
        subject,
        message
    );

    const rows = await findContactById(result.insertId);

    return rows[0];
}


module.exports = {
    getAllContactsService,
    getContactByIdService,
    createContactService,
};