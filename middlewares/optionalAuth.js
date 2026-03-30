const { verifyToken } = require("../utils/jwt");

function optionalAuth(req, _res, next) {
    try {
        const authHeader = req.headers.authorization || "";

        if (!authHeader.startsWith("Bearer ")) {
            return next();
        }

        const token = authHeader.split(" ")[1];
        if (!token) return next();

        const decoded = verifyToken(token);
        req.user = decoded;

        return next();
    } catch (e) {
        return next();
    }
}

module.exports = optionalAuth;