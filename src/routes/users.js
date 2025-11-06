/**
 * User Routes
 * 
 * This file defines all routes related to user management.
 * These are demo routes for demonstration purposes only.
 * In a real application, you would connect these to a database.
 */

import { Router } from "express";

const router = Router();

// In-memory storage for demo purposes (replace with database in production)
// This simulates a database for demonstration
let users = [
    { id: 1, name: "John Doe", email: "john@example.com", createdAt: new Date().toISOString() },
    { id: 2, name: "Jane Smith", email: "jane@example.com", createdAt: new Date().toISOString() },
];

// ============================================
// GET Routes
// ============================================

/**
 * GET /api/users
 * 
 * Get all users
 * Returns a list of all users in the system
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users,
    });
});

/**
 * GET /api/users/:id
 * 
 * Get a single user by ID
 * @param {string} id - User ID from URL parameter
 */
router.get("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find user by ID
    const user = users.find((u) => u.id === id);

    // If user not found, return 404 error
    if (!user) {
        const error = new Error(`User with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Return the found user
    res.json({
        success: true,
        data: user,
    });
});

// ============================================
// POST Routes
// ============================================

/**
 * POST /api/users
 * 
 * Create a new user
 * Expects JSON body with name and email fields
 */
router.post("/", (req, res, next) => {
    // Extract data from request body
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
        const error = new Error("Name and email are required");
        error.statusCode = 400;
        return next(error);
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = new Error("Invalid email format");
        error.statusCode = 400;
        return next(error);
    }

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.statusCode = 409;
        return next(error);
    }

    // Create new user object
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name,
        email,
        createdAt: new Date().toISOString(),
    };

    // Add user to the array (in production, save to database)
    users.push(newUser);

    // Return the created user with 201 status code
    res.status(201).json({
        success: true,
        data: newUser,
    });
});

// ============================================
// PUT Routes
// ============================================

/**
 * PUT /api/users/:id
 * 
 * Update an existing user
 * @param {string} id - User ID from URL parameter
 */
router.put("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find user index in array
    const userIndex = users.findIndex((u) => u.id === id);

    // If user not found, return 404 error
    if (userIndex === -1) {
        const error = new Error(`User with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Extract data from request body
    const { name, email } = req.body;

    // Validate that at least one field is provided
    if (!name && !email) {
        const error = new Error("At least one field (name or email) is required for update");
        error.statusCode = 400;
        return next(error);
    }

    // Validate email format if email is being updated
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const error = new Error("Invalid email format");
            error.statusCode = 400;
            return next(error);
        }

        // Check if email already exists for another user
        const existingUser = users.find((u) => u.email === email && u.id !== id);
        if (existingUser) {
            const error = new Error("User with this email already exists");
            error.statusCode = 409;
            return next(error);
        }
    }

    // Update user fields (only update provided fields)
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    // Return the updated user
    res.json({
        success: true,
        data: users[userIndex],
    });
});

// ============================================
// DELETE Routes
// ============================================

/**
 * DELETE /api/users/:id
 * 
 * Delete a user by ID
 * @param {string} id - User ID from URL parameter
 */
router.delete("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Find user index in array
    const userIndex = users.findIndex((u) => u.id === id);

    // If user not found, return 404 error
    if (userIndex === -1) {
        const error = new Error(`User with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Remove user from array (in production, delete from database)
    const deletedUser = users.splice(userIndex, 1)[0];

    // Return success message with deleted user data
    res.json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
});

export default router;

