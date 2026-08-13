const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const buildOrderItemsHtml = (items = []) => {
    return items
        .map((item) => {
            const quantity = Number(item.qty ?? 1);
            const price = Number(item.price ?? 0);
            const itemTotal = price * quantity;

            return `
                <tr>
                    <td style="padding: 12px 0;">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            width="70"
                            height="70"
                            style="
                                width: 70px;
                                height: 70px;
                                object-fit: cover;
                                border-radius: 10px;
                                display: block;
                            "
                        />
                    </td>

                    <td style="padding: 12px 16px;">
                        <div
                            style="
                                font-size: 15px;
                                font-weight: 700;
                                color: #333333;
                                margin-bottom: 5px;
                            "
                        >
                            ${item.name}
                        </div>

                        <div
                            style="
                                font-size: 13px;
                                color: #666666;
                            "
                        >
                            Qty: ${quantity}
                        </div>
                    </td>

                    <td
                        align="right"
                        style="
                            padding: 12px 0;
                            font-size: 15px;
                            font-weight: 700;
                            color: #333333;
                            white-space: nowrap;
                        "
                    >
                        $${itemTotal.toFixed(2)}
                    </td>
                </tr>
            `;
        })
        .join("");
};

const sendTestEmail = async (to) => {
    const testItems = [
        {
            name: "Pit Stop Classic",
            price: 5,
            qty: 2,
            image: "https://media.istockphoto.com/id/2158592905/photo/beef-patty-burger-with-vegetables-and-lettuce-on-white-background-file-contains-clipping-path.jpg",
        },
        {
            name: "Turbo Bacon",
            price: 6,
            qty: 1,
            image: "https://i.ibb.co/VYGzxRYF/x-tudo.jpg",
        },
        {
            name: "Coke",
            price: 2.5,
            qty: 1,
            image: "https://back-end-fast-fuel-production.up.railway.app/images/Coke.png",
        },
    ];

    const itemsHtml = buildOrderItemsHtml(testItems);

    const { data, error } = await resend.emails.send({
        from: "Fast Fuel <orders@fast-fuel-orders.com>",
        to: [to],
        subject: "Fast Fuel - Order Items Test",
        html: `
            <div
                style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 24px;
                "
            >
                <h2 style="color:#0d47a1;">
                    Your Order
                </h2>

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="border-collapse: collapse;"
                >
                    ${itemsHtml}
                </table>
            </div>
        `,
    });

    if (error) {
        throw error;
    }

    return data;
};

module.exports = {
    sendTestEmail,
};