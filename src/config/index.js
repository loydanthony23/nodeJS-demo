/**
 * Application Configuration
 * 
 * This file manages environment variables and provides a centralized configuration object.
 * It uses dotenv to load environment variables from a .env file.
 */

import dotenv from "dotenv";

// Load environment variables from .env file into process.env
// The .env file should be in the root directory of the project
dotenv.config();

/**
 * Application configuration object
 * Contains all environment-based settings with sensible defaults
 */
export const config = {
    // Environment mode: "development" or "production"
    // Affects logging, error messages, and other environment-specific behaviors
    env: process.env.NODE_ENV,
    
    // Port number for the HTTP server
    // Defaults to 3000 if not specified in environment variables
    port: process.env.PORT,
    
    // Application name displayed in logs and API responses
    appName: process.env.APP_NAM,
};
