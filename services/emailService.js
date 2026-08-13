const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const formatMoney = (value = 0) => {
    return `$${Number(value || 0).toFixed(2)}`;
};

const buildAddressHtml = (address = {}) => {
    const line1 = [address.street, address.apt ? `Apt ${address.apt}` : ""]
        .filter(Boolean)
        .join(", ");

    const line2 = [address.city, address.state, address.zip]
        .filter(Boolean)
        .join(", ");

    const line3 = address.country || "USA";

    return [line1, line2, line3]
        .filter(Boolean)
        .map(
            (line) => `
                <div style="font-size: 14px; color: #444; line-height: 1.5;">
                    ${line}
                </div>
            `
        )
        .join("");
};

const imageStylesOrder = {
    "1": { width: "60px", height: "52px", marginTop: "3px" },
    "2": { width: "90px", height: "77px", marginTop: "0px", },
    "3": { width: "65px", height: "55px", marginTop: "0px" },
    "4": { width: "85px", height: "65px", marginTop: "-2px", },
    "11": { width: "70px", height: "73px", marginTop: "0px" },
    "12": { width: "79px", height: "65px", marginTop: "0px" },
    "13": { width: "75px", height: "65px", marginTop: "4px" },
    "14": { width: "63px", height: "68px", marginTop: "0px" },
    "5": { width: "79px", height: "79px", marginTop: "0px" },
    "6": { width: "79px", height: "79px", marginTop: "0px" },
    "7": { width: "79px", height: "79px", marginTop: "0px" },
    "8": { width: "79px", height: "79px", marginTop: "0px" },
    "9": { width: "79px", height: "79px", marginTop: "0px" },
    "10": { width: "79px", height: "79px", marginTop: "0px" },
    "15": { width: "100px", height: "84px", marginTop: "0px", },
    "16": { width: "82px", height: "77px", marginTop: "0px" },
    "17": { width: "73px", height: "79px", marginTop: "0px" },
    "18": { width: "60px", height: "51px", marginTop: "0px" },
};

const buildOrderItemsHtml = (items = []) => {
    return items
        .map((item) => {
            const quantity = Number(item.qty ?? 1);
            const price = Number(item.price ?? 0);
            const itemTotal = price * quantity;

            const imageStyle =
                imageStylesOrder[String(item.id)] || {
                    width: "70px",
                    height: "70px",
                    marginTop: "0px",
                };

            return `
                <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            style="
                                width: ${imageStyle.width};
                                height: ${imageStyle.height};
                                margin-top: ${imageStyle.marginTop};
                                object-fit: contain;
                                display: block;
                            "
                        />
                    </td>

                    <td
                        width="110"
                        style="
                            width: 110px;
                            padding: 12px 0;
                            vertical-align: top;
                            text-align: center;
                        "
                    >
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
                            vertical-align: top;
                            font-size: 15px;
                            font-weight: 700;
                            color: #333333;
                            white-space: nowrap;
                        "
                    >
                        ${formatMoney(itemTotal)}
                    </td>
                </tr>
            `;
        })
        .join("");
};

const buildTrackingUrl = ({ orderCode, customerEmail }) => {
    const base =
        process.env.ORDER_TRACKING_URL ||
        (process.env.FRONTEND_URL
            ? `${process.env.FRONTEND_URL}/orders`
            : "");

    if (!base) return "";

    const separator = base.includes("?") ? "&" : "?";

    return `${base}${separator}order_code=${encodeURIComponent(
        orderCode
    )}&email=${encodeURIComponent(customerEmail || "")}`;
};

const sendOrderConfirmationEmail = async ({
    customerName,
    customerEmail,
    orderCode,
    deliveryAddress,
    items,
    subtotal,
    discount,
    tax,
    deliveryFee,
    total,
}) => {
    const itemsHtml = buildOrderItemsHtml(items);
    const addressHtml = buildAddressHtml(deliveryAddress);

    const discountValue = Number(discount || 0);

    const discountDisplay =
        discountValue > 0
            ? `-$${discountValue.toFixed(2)}`
            : "$0.00";

    const trackingUrl = buildTrackingUrl({
        orderCode,
        customerEmail,
    });

    const { data, error } = await resend.emails.send({
        from: "Fast Fuel <orders@fast-fuel-orders.com>",
        to: [customerEmail],
        subject: `Fast Fuel - Order Received #${orderCode}`,
        html: `
            <div
                style="
                    margin: 0;
                    padding: 24px 12px;
                    background: #fffaf5;
                    font-family: Arial, sans-serif;
                    color: #222;
                "
            >
                <div
                    style="
                        max-width: 640px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 18px;
                        overflow: hidden;
                        border: 1px solid #f0e4d8;
                    "
                >
                    <div
                        style="
                            background: #0d47a1;
                            padding: 24px;
                            text-align: center;
                        "
                    >
                        <div
                            style="
                                color: #ffffff;
                                font-size: 24px;
                                font-weight: 800;
                                letter-spacing: 0.04em;
                            "
                        >
                            FAST FUEL
                        </div>

                        <div
                            style="
                                color: #ffe0c7;
                                font-size: 14px;
                                margin-top: 8px;
                                letter-spacing: 0.08em;
                                text-transform: uppercase;
                            "
                        >
                            Order Received
                        </div>
                    </div>

                    <div style="padding: 28px 24px;">
                        <p style="font-size: 15px; margin: 0 0 18px;">
                            Hi <strong>${customerName || "Customer"}</strong>,
                        </p>

                        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                            We received your order and it is now waiting for preparation.
                            Your order details are below.
                        </p>

                        <div
                            style="
                                background: #fff7ef;
                                border: 1px solid #f3ddc8;
                                border-radius: 14px;
                                padding: 18px;
                                margin-bottom: 22px;
                            "
                        >
                            <div style="margin-bottom: 12px;">
                                <div
                                    style="
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        letter-spacing: 0.08em;
                                        color: #777;
                                        margin-bottom: 4px;
                                    "
                                >
                                    Order Number
                                </div>

                                <div
                                    style="
                                        font-size: 22px;
                                        font-weight: 800;
                                        color: #e65100;
                                    "
                                >
                                    ${orderCode}
                                </div>
                            </div>

                            <div>
                                <div
                                    style="
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        letter-spacing: 0.08em;
                                        color: #777;
                                        margin-bottom: 6px;
                                    "
                                >
                                    Delivery To
                                </div>

                                ${addressHtml}
                            </div>
                        </div>

                        <div
                            style="
                                font-size: 16px;
                                font-weight: 800;
                                color: #0d47a1;
                                margin-bottom: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.06em;
                            "
                        >
                            Your Order
                        </div>

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                                border-collapse: collapse;
                                margin-bottom: 20px;
                            "
                        >
                            ${itemsHtml}
                        </table>

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                                border-collapse: collapse;
                                margin-top: 20px;
                                border-top: 1px solid #eee;
                                padding-top: 12px;
                            "
                        >
                            <tr>
                                <td style="padding: 6px 0; color: #555;">Subtotal</td>
                                <td align="right" style="padding: 6px 0; color: #555;">
                                    ${formatMoney(subtotal)}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 6px 0; color: #555;">Combo Discount</td>
                                <td align="right" style="padding: 6px 0; color: #555;">
                                    ${discountDisplay}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 6px 0; color: #555;">Tax</td>
                                <td align="right" style="padding: 6px 0; color: #555;">
                                    ${formatMoney(tax)}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 6px 0; color: #555;">Delivery</td>
                                <td align="right" style="padding: 6px 0; color: #555;">
                                    ${formatMoney(deliveryFee)}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        padding: 12px 0 0;
                                        font-size: 18px;
                                        font-weight: 800;
                                        color: #0d47a1;
                                    "
                                >
                                    Total
                                </td>
                                <td
                                    align="right"
                                    style="
                                        padding: 12px 0 0;
                                        font-size: 18px;
                                        font-weight: 800;
                                        color: #0d47a1;
                                    "
                                >
                                    ${formatMoney(total)}
                                </td>
                            </tr>
                        </table>

                        ${trackingUrl
                ? `
                                    <div style="text-align: center; margin-top: 28px;">
                                        <a
                                            href="${trackingUrl}"
                                            style="
                                                display: inline-block;
                                                background: #e65100;
                                                color: #ffffff;
                                                text-decoration: none;
                                                font-weight: 800;
                                                font-size: 14px;
                                                padding: 14px 22px;
                                                border-radius: 999px;
                                                letter-spacing: 0.06em;
                                                text-transform: uppercase;
                                            "
                                        >
                                            Track Your Order
                                        </a>
                                    </div>
                                `
                : ""
            }

                        <p
                            style="
                                margin-top: 24px;
                                font-size: 13px;
                                color: #777;
                                line-height: 1.6;
                                text-align: center;
                            "
                        >
                            You can use your order number and email to track your order status.
                        </p>
                    </div>
                </div>
            </div>
        `,
    });

    if (error) {
        throw error;
    }

    return data;
};

const sendTestEmail = async (to) => {
    const { data, error } = await resend.emails.send({
        from: "Fast Fuel <orders@fast-fuel-orders.com>",
        to: [to],
        subject: "Fast Fuel - Test Email",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Fast Fuel</h2>
                <p>Your Resend integration is working.</p>
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
    sendOrderConfirmationEmail,
};