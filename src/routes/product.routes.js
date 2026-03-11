"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get("/", product_controller_1.getAllProducts);
router.get("/seller", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorize)("SELLER"), product_controller_1.getSellerProducts);
router.get("/:id", product_controller_1.getProductById);
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorize)("SELLER"), product_controller_1.createProduct);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorize)("SELLER"), product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorize)("SELLER"), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map