"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = checkout;
exports.getMyOrders = getMyOrders;
exports.getSellerOrders = getSellerOrders;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
async function checkout(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            let totalPrice = 0;
            for (const item of cart.items) {
                if (item.quantity > item.product.stock) {
                    throw new Error(`Stock not enough for ${item.product.title}`);
                }
                totalPrice += item.quantity * item.product.price;
            }
            const order = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    status: "PENDING"
                }
            });
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }
                });
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            return order;
        });
        res.status(201).json({
            message: "Checkout successful",
            order: result
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || "Checkout failed" });
    }
}
async function getMyOrders(req, res) {
    try {
        const userId = req.user.userId;
        const orders = await prisma_1.prisma.order.findMany({
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
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get orders" });
    }
}
async function getSellerOrders(req, res) {
    try {
        const sellerId = req.user.userId;
        const orders = await prisma_1.prisma.orderItem.findMany({
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
        });
        res.json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch seller orders"
        });
    }
}
//# sourceMappingURL=order.controller.js.map