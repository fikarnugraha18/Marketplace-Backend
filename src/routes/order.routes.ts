import express from "express"
import { checkout, getMyOrders } from "../controllers/order.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { getSellerOrders } from "../controllers/order.controller"  
import { authorize } from "../middleware/role.middleware"

const router = express.Router()

router.post("/checkout", authMiddleware, checkout)
router.get("/", authMiddleware, getMyOrders)
router.get(
  "/seller",
  authMiddleware,
  authorize("SELLER"),
  getSellerOrders
)

export default router