import express from "express";
import {
  getOrders,
  getOrderById,
  createOrderFromCart,
  updateOrderStatus,
  deleteOrder,
  getAllOrdersAdmin,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden, admin access required
 */
router.route("/admin").get(protect, getAllOrdersAdmin);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get the logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's orders
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create an order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid or empty cart
 *       401:
 *         description: Not authorized
 */
router.route("/").get(protect, getOrders).post(protect, createOrderFromCart);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order removed
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 */
router.route("/:id").get(protect, getOrderById).delete(protect, deleteOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 */
router.route("/:id/status").put(protect, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/webhook-status:
 *   put:
 *     summary: Update order status via payment gateway webhook
 *     tags: [Orders]
 *     description: Called by external payment providers to update order status. Not authenticated via user JWT — should be secured with webhook signature verification.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.route("/:id/webhook-status").put(updateOrderStatus);

export default router;