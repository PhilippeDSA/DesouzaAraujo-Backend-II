export const checkRole = (roles) => {
    return (req, res, next) => {
        // req.user viene del passport JWT
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }

        // Si el rol del usuario NO está en los roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden: insufficient permissions" });
        }

        // Si todo OK
        next();
    };
};
