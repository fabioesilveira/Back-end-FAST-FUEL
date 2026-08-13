const { sendTestEmail } = require("../services/emailService");

const testEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "email is required",
            });
        }

        const result = await sendTestEmail(email);

        return res.status(200).json({
            message: "Test email sent successfully",
            result,
        });
    } catch (error) {
        console.error("Resend email error:", error);

        return res.status(500).json({
            message: "Failed to send test email",
        });
    }
};

module.exports = {
    testEmail,
};