import { Response } from "express"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/auth.middleware"

export async function checkout(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const result = await prisma.$transaction(async (tx) => {

      let totalPrice = 0

      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          throw new Error(`Stock not enough for ${item.product.title}`)
        }
        totalPrice += item.quantity * item.product.price
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: "PENDING"
        }
      })

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        })

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      })

      return order
    })

    res.status(201).json({
      message: "Checkout successful",
      order: result
    })

  } catch (error: any) {
    console.error(error)
    res.status(400).json({ message: error.message || "Checkout failed" })
  }
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(orders)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to get orders" })
  }
}

export async function getSellerOrders(req: AuthRequest, res: Response) {
  try {

    const sellerId = req.user!.userId

    const orders = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId
        }
      },
      include: {
        order: true,
        product: true
      },
      orderBy: {
        order: {
          createdAt: "desc"
        }
      }
    })

    res.json({
      success: true,
      data: orders
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller orders"
    })
  }
}