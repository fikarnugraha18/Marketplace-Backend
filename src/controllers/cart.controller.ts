import { Response } from "express"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/auth.middleware"

export async function addToCart(req: AuthRequest, res: Response) {
  try {
    const { productId, quantity } = req.body
    const userId = req.user!.userId

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock not enough" })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    res.status(201).json({ message: "Added to cart" })

  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart" })
  }
}

export async function getMyCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 })
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)

    res.json({
      items: cart.items,
      totalPrice
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to get cart" })
  }
}

export async function updateCartItem(req: AuthRequest, res: Response) {
  try {
    const { itemId } = req.params
    const { quantity } = req.body
    const userId = req.user!.userId

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" })
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ message: "Stock not enough" })
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    res.json(updated)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update cart item" })
  }
}

export async function deleteCartItem(req: AuthRequest, res: Response) {
  try {
    const { itemId } = req.params
    const userId = req.user!.userId

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    res.json({ message: "Item removed from cart" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete cart item" })
  }
}

export async function deleteCartItem(req: AuthRequest, res: Response) {
  try {
    const { itemId } = req.params
    const userId = req.user!.userId

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    res.json({ message: "Item removed from cart" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete cart item" })
  }
}