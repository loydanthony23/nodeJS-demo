/**
 * Express Application Setup
 * 
 * This file configures the Express application with middleware and routes.
 * It serves as the main application configuration file.
 */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application instance
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS (Cross-Origin Resource Sharing) for all routes
// This allows the API to be accessed from different domains/origins
app.use(cors());

// Parse incoming JSON requests and make them available in req.body
// This middleware allows the API to handle JSON payloads
app.use(express.json());

// ============================================
// Route Configuration
// ============================================

// Mount all API routes under the "/api" prefix
// Example: "/api/users" will be accessible at this path
app.use("/api", router);

// Serve static files from the frontend directory
// This allows the frontend HTML, CSS, and JS files to be served
// __dirname is src/, so we go up one level to reach the project root
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath, { index: false })); // Don't auto-serve index.html

// Serve index.html for all non-API routes (for SPA routing if needed)
// This must be placed after API routes but before error handler
// Note: Express 5.x requires a different pattern for catch-all routes
app.use((req, res, next) => {
    // Skip API routes - let them pass through to error handler if not found
    if (req.path.startsWith("/api")) {
        return next();
    }
    // Serve the frontend index.html for all other routes
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) {
            // If file not found, pass to error handler
            next(err);
        }
    });
});

// ============================================
// Error Handling Middleware
// ============================================

// Custom error handling middleware (must be last)
// This catches any errors thrown in routes and sends appropriate responses
app.use(errorHandler);

export default app;
