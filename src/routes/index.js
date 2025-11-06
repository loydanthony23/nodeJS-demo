/**
 * Main API Routes
 * 
 * This file defines the main API routes and serves as the router aggregator.
 * It imports and mounts all sub-routers for different resources.
 */

import { Router } from "express";
import { config } from "../config/index.js";
import usersRouter from "./users.js";
import productsRouter from "./products.js";

// Create a new Express router instance
const router = Router();

// ============================================
// Health Check Route
// ============================================

/**
 * GET /api/
 * 
 * Health check endpoint that returns application status and information.
 * Useful for monitoring and deployment verification.
 */
router.get("/", (req, res) => {
    res.json({
        message: "✅ App is running!",
        environment: config.env,
        appName: config.appName,
        time: new Date().toISOString(),
    });
});

// ============================================
// Resource Routes
// ============================================

// Mount user routes at /api/users
// All routes defined in users.js will be prefixed with /users
router.use("/users", usersRouter);

// Mount product routes at /api/products
// All routes defined in products.js will be prefixed with /products
router.use("/products", productsRouter);

export default router;
