import { Router } from "express"
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts
} from "../controllers/product.controller"

import { authMiddleware } from "../middleware/auth.middleware"
import { authorize } from "../middleware/role.middleware"

const router = Router()

router.get("/", getAllProducts)

router.get(
  "/seller",
  authMiddleware,
  authorize("SELLER"),
  getSellerProducts
)

router.get("/:id", getProductById)

router.post(
  "/",
  authMiddleware,
  authorize("SELLER"),
  createProduct
)

router.put(
  "/:id",
  authMiddleware,
  authorize("SELLER"),
  updateProduct
)

router.delete(
  "/:id",
  authMiddleware,
  authorize("SELLER"),
  deleteProduct
)

export default router