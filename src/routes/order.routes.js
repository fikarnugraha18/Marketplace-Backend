"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_controller_2 = require("../controllers/order.controller");
const role_middleware_1 = require("../middleware/role.middleware");
const router = express_1.default.Router();
router.post("/checkout", auth_middleware_1.authMiddleware, order_controller_1.checkout);
router.get("/", auth_middleware_1.authMiddleware, order_controller_1.getMyOrders);
router.get("/seller", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorize)("SELLER"), order_controller_2.getSellerOrders);
exports.default = router;
//# sourceMappingURL=order.routes.js.map