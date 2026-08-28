import express from 'express';
import { getStats } from "../controllers/statsController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Dashboard statistics and analytics
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   description: Aggregated dashboard statistics
 *       401:
 *         description: Not authorized, no token or invalid token
 *       500:
 *         description: Server error
 */
router.get("/", protect, getStats);

export default router;