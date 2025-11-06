/**
 * HTTP Server Entry Point
 * 
 * This file creates and starts the HTTP server that serves the Express application.
 * It's the entry point for the application when running npm start or npm run dev.
 */

import http from "http";
import app from "./app.js";
import { config } from "./config/index.js";

// Create HTTP server instance using the Express app
// The Express app handles all incoming HTTP requests
const server = http.createServer(app);

// Start the server and listen on the configured port
server.listen(config.port, () => {
    // Log server startup information
    console.log(
        `🚀 ${config.appName} running in ${config.env} on port ${config.port}`
    );
});
