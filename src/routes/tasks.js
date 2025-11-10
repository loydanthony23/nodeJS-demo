/**
 * Task Routes - Sample RESTful API
 * 
 * This file demonstrates a complete RESTful API implementation for task management.
 * It includes all CRUD operations (Create, Read, Update, Delete) with proper:
 * - HTTP status codes
 * - Error handling
 * - Input validation
 * - Query parameters for filtering
 * 
 * RESTful principles demonstrated:
 * - GET    /api/tasks          - List all resources (with filtering)
 * - GET    /api/tasks/:id      - Get a single resource
 * - POST   /api/tasks          - Create a new resource
 * - PUT    /api/tasks/:id      - Update an existing resource (full update)
 * - PATCH  /api/tasks/:id      - Partial update of a resource
 * - DELETE /api/tasks/:id      - Delete a resource
 */

import { Router } from "express";

const router = Router();

// In-memory storage for demo purposes (replace with database in production)
// This simulates a database for demonstration
let tasks = [
    {
        id: 1,
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the Node.js API project",
        status: "pending",
        priority: "high",
        dueDate: "2024-12-31",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Review code changes",
        description: "Review and merge pull request #42",
        status: "in-progress",
        priority: "medium",
        dueDate: "2024-12-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        title: "Update dependencies",
        description: "Update npm packages to latest versions",
        status: "completed",
        priority: "low",
        dueDate: "2024-12-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// ============================================
// GET Routes - Read Operations
// ============================================

/**
 * GET /api/tasks
 * 
 * Get all tasks with optional filtering and sorting
 * 
 * Query Parameters:
 * - status: Filter by status (pending, in-progress, completed)
 * - priority: Filter by priority (low, medium, high)
 * - sortBy: Sort field (title, priority, dueDate, createdAt)
 * - order: Sort order (asc, desc) - default: asc
 * 
 * Example: GET /api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc
 */
router.get("/", (req, res) => {
    let filteredTasks = [...tasks];

    // Filter by status if provided
    if (req.query.status) {
        const validStatuses = ["pending", "in-progress", "completed"];
        if (validStatuses.includes(req.query.status.toLowerCase())) {
            filteredTasks = filteredTasks.filter(
                (task) => task.status.toLowerCase() === req.query.status.toLowerCase()
            );
        }
    }

    // Filter by priority if provided
    if (req.query.priority) {
        const validPriorities = ["low", "medium", "high"];
        if (validPriorities.includes(req.query.priority.toLowerCase())) {
            filteredTasks = filteredTasks.filter(
                (task) => task.priority.toLowerCase() === req.query.priority.toLowerCase()
            );
        }
    }

    // Sort tasks if sortBy parameter is provided
    if (req.query.sortBy) {
        const sortField = req.query.sortBy;
        const sortOrder = req.query.order === "desc" ? -1 : 1;

        // Validate sort field
        const validSortFields = ["title", "priority", "dueDate", "createdAt"];
        if (validSortFields.includes(sortField)) {
            filteredTasks.sort((a, b) => {
                // Handle priority sorting (convert to numeric value)
                if (sortField === "priority") {
                    const priorityOrder = { low: 1, medium: 2, high: 3 };
                    return (priorityOrder[a.priority] - priorityOrder[b.priority]) * sortOrder;
                }

                // Handle date sorting
                if (sortField === "dueDate" || sortField === "createdAt") {
                    return (new Date(a[sortField]) - new Date(b[sortField])) * sortOrder;
                }

                // Handle string sorting
                if (a[sortField] < b[sortField]) return -1 * sortOrder;
                if (a[sortField] > b[sortField]) return 1 * sortOrder;
                return 0;
            });
        }
    }

    // Return filtered and sorted tasks
    res.json({
        success: true,
        count: filteredTasks.length,
        data: filteredTasks,
    });
});

/**
 * GET /api/tasks/:id
 * 
 * Get a single task by ID
 * 
 * @param {string} id - Task ID from URL parameter
 */
router.get("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Validate ID is a valid number
    if (isNaN(id)) {
        const error = new Error("Invalid task ID");
        error.statusCode = 400;
        return next(error);
    }

    // Find task by ID
    const task = tasks.find((t) => t.id === id);

    // If task not found, return 404 error
    if (!task) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Return the found task
    res.json({
        success: true,
        data: task,
    });
});

// ============================================
// POST Route - Create Operation
// ============================================

/**
 * POST /api/tasks
 * 
 * Create a new task
 * 
 * Expected JSON body:
 * {
 *   "title": "Task title (required)",
 *   "description": "Task description (optional)",
 *   "status": "pending|in-progress|completed (optional, default: pending)",
 *   "priority": "low|medium|high (optional, default: medium)",
 *   "dueDate": "YYYY-MM-DD (optional)"
 * }
 */
router.post("/", (req, res, next) => {
    // Extract data from request body
    const { title, description, status, priority, dueDate } = req.body;

    // Validate required fields
    if (!title || title.trim() === "") {
        const error = new Error("Title is required");
        error.statusCode = 400;
        return next(error);
    }

    // Validate status if provided
    if (status) {
        const validStatuses = ["pending", "in-progress", "completed"];
        if (!validStatuses.includes(status.toLowerCase())) {
            const error = new Error(
                `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            );
            error.statusCode = 400;
            return next(error);
        }
    }

    // Validate priority if provided
    if (priority) {
        const validPriorities = ["low", "medium", "high"];
        if (!validPriorities.includes(priority.toLowerCase())) {
            const error = new Error(
                `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
            );
            error.statusCode = 400;
            return next(error);
        }
    }

    // Validate date format if dueDate is provided
    if (dueDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            const error = new Error("Invalid date format. Use YYYY-MM-DD");
            error.statusCode = 400;
            return next(error);
        }
    }

    // Create new task object with defaults
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        title: title.trim(),
        description: description ? description.trim() : "",
        status: status ? status.toLowerCase() : "pending",
        priority: priority ? priority.toLowerCase() : "medium",
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Add task to the array (in production, save to database)
    tasks.push(newTask);

    // Return the created task with 201 status code (Created)
    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
    });
});

// ============================================
// PUT Route - Full Update Operation
// ============================================

/**
 * PUT /api/tasks/:id
 * 
 * Update an existing task (full update - replaces entire resource)
 * All fields are required for a PUT request
 * 
 * @param {string} id - Task ID from URL parameter
 */
router.put("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id)) {
        const error = new Error("Invalid task ID");
        error.statusCode = 400;
        return next(error);
    }

    // Find task index in array
    const taskIndex = tasks.findIndex((t) => t.id === id);

    // If task not found, return 404 error
    if (taskIndex === -1) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Extract data from request body
    const { title, description, status, priority, dueDate } = req.body;

    // Validate required fields for full update
    if (!title || title.trim() === "") {
        const error = new Error("Title is required for update");
        error.statusCode = 400;
        return next(error);
    }

    // Validate status
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
        const error = new Error(
            `Status is required and must be one of: ${validStatuses.join(", ")}`
        );
        error.statusCode = 400;
        return next(error);
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high"];
    if (!priority || !validPriorities.includes(priority.toLowerCase())) {
        const error = new Error(
            `Priority is required and must be one of: ${validPriorities.join(", ")}`
        );
        error.statusCode = 400;
        return next(error);
    }

    // Validate date format if dueDate is provided
    if (dueDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            const error = new Error("Invalid date format. Use YYYY-MM-DD");
            error.statusCode = 400;
            return next(error);
        }
    }

    // Update task with new values (full replacement)
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title.trim(),
        description: description ? description.trim() : "",
        status: status.toLowerCase(),
        priority: priority.toLowerCase(),
        dueDate: dueDate || null,
        updatedAt: new Date().toISOString(),
    };

    // Return the updated task
    res.json({
        success: true,
        message: "Task updated successfully",
        data: tasks[taskIndex],
    });
});

// ============================================
// PATCH Route - Partial Update Operation
// ============================================

/**
 * PATCH /api/tasks/:id
 * 
 * Partially update an existing task (only provided fields are updated)
 * This is more flexible than PUT as it allows updating only specific fields
 * 
 * @param {string} id - Task ID from URL parameter
 */
router.patch("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id)) {
        const error = new Error("Invalid task ID");
        error.statusCode = 400;
        return next(error);
    }

    // Find task index in array
    const taskIndex = tasks.findIndex((t) => t.id === id);

    // If task not found, return 404 error
    if (taskIndex === -1) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Extract data from request body
    const { title, description, status, priority, dueDate } = req.body;

    // Validate that at least one field is provided for update
    if (!title && !description && !status && !priority && dueDate === undefined) {
        const error = new Error("At least one field is required for update");
        error.statusCode = 400;
        return next(error);
    }

    // Validate and update title if provided
    if (title !== undefined) {
        if (!title || title.trim() === "") {
            const error = new Error("Title cannot be empty");
            error.statusCode = 400;
            return next(error);
        }
        tasks[taskIndex].title = title.trim();
    }

    // Update description if provided
    if (description !== undefined) {
        tasks[taskIndex].description = description.trim();
    }

    // Validate and update status if provided
    if (status) {
        const validStatuses = ["pending", "in-progress", "completed"];
        if (!validStatuses.includes(status.toLowerCase())) {
            const error = new Error(
                `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            );
            error.statusCode = 400;
            return next(error);
        }
        tasks[taskIndex].status = status.toLowerCase();
    }

    // Validate and update priority if provided
    if (priority) {
        const validPriorities = ["low", "medium", "high"];
        if (!validPriorities.includes(priority.toLowerCase())) {
            const error = new Error(
                `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
            );
            error.statusCode = 400;
            return next(error);
        }
        tasks[taskIndex].priority = priority.toLowerCase();
    }

    // Validate and update dueDate if provided
    if (dueDate !== undefined) {
        if (dueDate === null || dueDate === "") {
            tasks[taskIndex].dueDate = null;
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dueDate)) {
                const error = new Error("Invalid date format. Use YYYY-MM-DD");
                error.statusCode = 400;
                return next(error);
            }
            tasks[taskIndex].dueDate = dueDate;
        }
    }

    // Update the updatedAt timestamp
    tasks[taskIndex].updatedAt = new Date().toISOString();

    // Return the updated task
    res.json({
        success: true,
        message: "Task updated successfully",
        data: tasks[taskIndex],
    });
});

// ============================================
// DELETE Route - Delete Operation
// ============================================

/**
 * DELETE /api/tasks/:id
 * 
 * Delete a task by ID
 * 
 * @param {string} id - Task ID from URL parameter
 */
router.delete("/:id", (req, res, next) => {
    // Convert ID parameter to number
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id)) {
        const error = new Error("Invalid task ID");
        error.statusCode = 400;
        return next(error);
    }

    // Find task index in array
    const taskIndex = tasks.findIndex((t) => t.id === id);

    // If task not found, return 404 error
    if (taskIndex === -1) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        return next(error);
    }

    // Remove task from array (in production, delete from database)
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    // Return success message with deleted task data
    res.json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask,
    });
});

export default router;

