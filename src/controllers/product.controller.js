"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getSellerProducts = getSellerProducts;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
/*
=============================
CREATE PRODUCT (SELLER)
POST /api/products
=============================
*/
async function createProduct(req, res) {
    try {
        const { title, description, price, stock } = req.body;
        const sellerId = req.user.userId;
        const product = await prisma_1.prisma.product.create({
            data: {
                title,
                description,
                price,
                stock,
                sellerId
            }
        });
        res.status(201).json({
            success: true,
            message: "Product created",
            data: product
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
}
/*
=============================
GET ALL PRODUCTS
GET /api/products
Supports:
pagination
search
price filter
=============================
*/
async function getAllProducts(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
        const where = {};
        if (search) {
            where.title = {
                contains: search,
                mode: "insensitive"
            };
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = minPrice;
            if (maxPrice)
                where.price.lte = maxPrice;
        }
        const [products, total] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            prisma_1.prisma.product.count({
                where
            })
        ]);
        res.json({
            success: true,
            data: products,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
}
/*
=============================
GET PRODUCT DETAIL
GET /api/products/:id
=============================
*/
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
}
/*
=============================
UPDATE PRODUCT
PUT /api/products/:id
Only product owner
=============================
*/
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { title, description, price, stock } = req.body;
        const userId = req.user.userId;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        if (product.sellerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        const updated = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                title,
                description,
                price,
                stock
            }
        });
        res.json({
            success: true,
            message: "Product updated",
            data: updated
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
}
/*
=============================
DELETE PRODUCT
DELETE /api/products/:id
Only product owner
=============================
*/
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        if (product.sellerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        await prisma_1.prisma.product.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: "Product deleted"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
}
async function getSellerProducts(req, res) {
    try {
        const sellerId = req.user.userId;
        const products = await prisma_1.prisma.product.findMany({
            where: {
                sellerId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch seller products"
        });
    }
}
//# sourceMappingURL=product.controller.js.map