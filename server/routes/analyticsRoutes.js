import express from "express";
import {
    getAnalyticsOverview,
    getProductAnalytics,
    getSalesAnalytics,
    getInventoryAlerts,
} from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Admin analytics and reporting
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     description: Returns an overview of sales, revenue, orders, products, and other key business metrics.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSales:
 *                       type: number
 *                       example: 12500
 *                     totalOrders:
 *                       type: integer
 *                       example: 150
 *                     totalProducts:
 *                       type: integer
 *                       example: 85
 *                     totalRevenue:
 *                       type: number
 *                       example: 12500
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.get("/overview", getAnalyticsOverview);

/**
 * @swagger
 * /api/analytics/products:
 *   get:
 *     summary: Get product analytics
 *     description: Returns analytics and performance data for products.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product analytics retrieved successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.get("/products", getProductAnalytics);

/**
 * @swagger
 * /api/analytics/sales:
 *   get:
 *     summary: Get sales analytics
 *     description: Returns sales and revenue analytics.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics retrieved successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.get("/sales", getSalesAnalytics);

/**
 * @swagger
 * /api/analytics/inventory-alerts:
 *   get:
 *     summary: Get inventory alerts
 *     description: Returns products that require inventory attention, such as low-stock products.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory alerts retrieved successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.get("/inventory-alerts", getInventoryAlerts);

export default router;
