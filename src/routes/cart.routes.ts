import express from "express"
import { addToCart, updateCartItem, deleteCartItem } from "../controllers/cart.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { getMyCart } from "../controllers/cart.controller"

const router = express.Router()

router.post("/", authMiddleware, addToCart)
router.get("/", authMiddleware, getMyCart)
router.patch("/:itemId", authMiddleware, updateCartItem)
router.delete("/:itemId", authMiddleware, deleteCartItem)

export default router