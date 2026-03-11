"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const cart_controller_2 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authMiddleware, cart_controller_1.addToCart);
router.get("/", auth_middleware_1.authMiddleware, cart_controller_2.getMyCart);
router.patch("/:itemId", auth_middleware_1.authMiddleware, cart_controller_1.updateCartItem);
router.delete("/:itemId", auth_middleware_1.authMiddleware, cart_controller_1.deleteCartItem);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map