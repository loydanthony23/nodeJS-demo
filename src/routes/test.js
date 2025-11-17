/**
 * Test Routes
 *
 * Simple hello world endpoint for quick verification.
 */
import { Router } from "express";

const router = Router();

/**
 * GET /hello
 * Returns a simple hello world JSON message
 */
router.get("/hello", (req, res) => {
    res.json({ message: "Hello, world!" });
});

export default router;