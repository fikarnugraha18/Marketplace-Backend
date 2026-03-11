"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const express_1 = require("express");
const auth_middleware_1 = require("./auth.middleware");
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map