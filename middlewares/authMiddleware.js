const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || "";

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token não encontrado ou mal formatado" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};

module.exports = authMiddleware;
