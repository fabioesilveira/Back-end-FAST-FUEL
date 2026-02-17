const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.type !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    return next();
};

module.exports = requireAdmin;
