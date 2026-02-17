const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET não definido no .env");
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_only";
const DEFAULT_OPTIONS = { expiresIn: "1h" };

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, DEFAULT_OPTIONS);
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new Error("TOKEN_EXPIRED");
        }
        throw new Error("TOKEN_INVALID");
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
