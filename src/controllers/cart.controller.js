"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = addToCart;
exports.getMyCart = getMyCart;
exports.updateCartItem = updateCartItem;
exports.deleteCartItem = deleteCartItem;
exports.deleteCartItem = deleteCartItem;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Stock not enough" });
        }
        let cart = await prisma_1.prisma.cart.findUnique({
            where: { userId }
        });
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: { userId }
            });
        }
        const existingItem = await prisma_1.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (existingItem) {
            await prisma_1.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            });
        }
        else {
            await prisma_1.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }
        res.status(201).json({ message: "Added to cart" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add to cart" });
    }
}
async function getMyCart(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart) {
            return res.json({ items: [], totalPrice: 0 });
        }
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
        res.json({
            items: cart.items,
            totalPrice
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get cart" });
    }
}
async function updateCartItem(req, res) {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.userId;
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }
        const cartItem = await prisma_1.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (quantity > cartItem.product.stock) {
            return res.status(400).json({ message: "Stock not enough" });
        }
        const updated = await prisma_1.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update cart item" });
    }
}
async function deleteCartItem(req, res) {
    try {
        const { itemId } = req.params;
        const userId = req.user.userId;
        const cartItem = await prisma_1.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await prisma_1.prisma.cartItem.delete({
            where: { id: itemId }
        });
        res.json({ message: "Item removed from cart" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete cart item" });
    }
}
async function deleteCartItem(req, res) {
    try {
        const { itemId } = req.params;
        const userId = req.user.userId;
        const cartItem = await prisma_1.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await prisma_1.prisma.cartItem.delete({
            where: { id: itemId }
        });
        res.json({ message: "Item removed from cart" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete cart item" });
    }
}
//# sourceMappingURL=cart.controller.js.map