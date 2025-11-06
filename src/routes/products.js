/**
 * Product Routes
 * 
 * This file defines all routes related to product management.
 * These are demo routes for demonstration purposes only.
 * In a real application, you would connect these to a database.
 */

import { Router } from "express";

const router = Router();

// In-memory storage for demo purposes (replace with database in production)
// This simulates a database for demonstration
let products = [
    {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        category: "Electronics",
        stock: 15,
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Coffee Maker",
        description: "Programmable coffee maker",
        price: 79.99,
        category: "Appliances",
        stock: 30,
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        name: "Running Shoes",
        description: "Comfortable running shoes",
        price: 129.99,
        category: "Sports",
        stock: 25,
        createdAt: new Date().toISOString(),
    },
];

// ============================================
// GET Routes
// ============================================

/**
 * GET /api/products
 * 
 * Get all products
 * Supports optional query parameters for filtering:
 * - category: Filter by product category
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 */
router.get("/", (req, res) => {
    let filteredProducts = [...products];

    // Filter by category if provided
    if (req.query.category) {
        filteredProducts = filteredProducts.filter(
            (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }

    // Filter by minimum price if provided
    if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
    }

    // Filter by maximum price if provided
    if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
    }

    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts,
    });
});

/**
 * GET /api/products/:id
 * 
 * Get a single product by ID
 * @param {string} id - Product ID from URL parameter
 */
router.get("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find product by ID
    const product = products.find((p) => p.id === id);

    // If product not found, return 404 error
    if (!product) {
        const error = new Error(`Product with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Return the found product
    res.json({
        success: true,
        data: product,
    });
});

// ============================================
// POST Routes
// ============================================

/**
 * POST /api/products
 * 
 * Create a new product
 * Expects JSON body with name, description, price, category, and stock fields
 */
router.post("/", (req, res, next) => {
    // Extract data from request body
    const { name, description, price, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !category || stock === undefined) {
        const error = new Error("Name, description, price, category, and stock are required");
        error.statusCode = 400;
        return next(error);
    }

    // Validate price is a positive number
    if (typeof price !== "number" || price < 0) {
        const error = new Error("Price must be a positive number");
        error.statusCode = 400;
        return next(error);
    }

    // Validate stock is a non-negative integer
    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
        const error = new Error("Stock must be a non-negative integer");
        error.statusCode = 400;
        return next(error);
    }

    // Create new product object
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        description,
        price,
        category,
        stock,
        createdAt: new Date().toISOString(),
    };

    // Add product to the array (in production, save to database)
    products.push(newProduct);

    // Return the created product with 201 status code
    res.status(201).json({
        success: true,
        data: newProduct,
    });
});

// ============================================
// PUT Routes
// ============================================

/**
 * PUT /api/products/:id
 * 
 * Update an existing product
 * @param {string} id - Product ID from URL parameter
 */
router.put("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find product index in array
    const productIndex = products.findIndex((p) => p.id === id);

    // If product not found, return 404 error
    if (productIndex === -1) {
        const error = new Error(`Product with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Extract data from request body
    const { name, description, price, category, stock } = req.body;

    // Validate that at least one field is provided
    if (!name && !description && price === undefined && !category && stock === undefined) {
        const error = new Error("At least one field is required for update");
        error.statusCode = 400;
        return next(error);
    }

    // Validate price if provided
    if (price !== undefined) {
        if (typeof price !== "number" || price < 0) {
            const error = new Error("Price must be a positive number");
            error.statusCode = 400;
            return next(error);
        }
    }

    // Validate stock if provided
    if (stock !== undefined) {
        if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
            const error = new Error("Stock must be a non-negative integer");
            error.statusCode = 400;
            return next(error);
        }
    }

    // Update product fields (only update provided fields)
    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (price !== undefined) products[productIndex].price = price;
    if (category) products[productIndex].category = category;
    if (stock !== undefined) products[productIndex].stock = stock;

    // Return the updated product
    res.json({
        success: true,
        data: products[productIndex],
    });
});

// ============================================
// DELETE Routes
// ============================================

/**
 * DELETE /api/products/:id
 * 
 * Delete a product by ID
 * @param {string} id - Product ID from URL parameter
 */
router.delete("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find product index in array
    const productIndex = products.findIndex((p) => p.id === id);

    // If product not found, return 404 error
    if (productIndex === -1) {
        const error = new Error(`Product with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Remove product from array (in production, delete from database)
    const deletedProduct = products.splice(productIndex, 1)[0];

    // Return success message with deleted product data
    res.json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});

export default router;

