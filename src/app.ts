import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes"
import { authMiddleware } from "./middleware/auth.middleware" 
import { authorize } from "./middleware/role.middleware"
import productRouter from "./routes/product.routes"
import cartRouter from "./routes/cart.routes"
import orderRouter from "./routes/order.routes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)


app.use("/api/auth", authRouter)
app.use("/api/orders", orderRouter) 

app.use("/api/me", authMiddleware, (req: any, res) => {
    res.json(req.user)
})

app.get(
  "/api/seller-test",
  authMiddleware,
  authorize("SELLER"),
  (req, res) => {
    res.json({ message: "Welcome Seller" })
  }
)


export default app