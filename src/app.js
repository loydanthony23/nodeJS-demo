/**
 * Express Application Setup
 * 
 * This file configures the Express application with middleware and routes.
 * It serves as the main application configuration file.
 */

import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

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

// Static files middleware (optional, for frontend build later)
// Uncomment this if you want to serve static files from a "public" directory
// app.use(express.static("public"));

// ============================================
// Error Handling Middleware
// ============================================

// Custom error handling middleware (must be last)
// This catches any errors thrown in routes and sends appropriate responses
app.use(errorHandler);

export default app;
