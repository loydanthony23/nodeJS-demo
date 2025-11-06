/**
 * Error Handling Middleware
 * 
 * This middleware catches all errors thrown in routes and sends appropriate
 * error responses to the client. It should be the last middleware in the chain.
 */

/**
 * Error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error("Error:", err);

    // Default error status code
    const statusCode = err.statusCode || 500;

    // Default error message
    const message = err.message || "Internal Server Error";

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            // Include stack trace in development mode for debugging
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
    });
};

export default errorHandler;

