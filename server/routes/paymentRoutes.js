import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createPaymentIntent,
    createKHQRPayment,
    checkKHQRPaymentStatus,
    handleStripeWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe and KHQR/Bakong payments
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create Stripe payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 66c123456789
 *     responses:
 *       200:
 *         description: Payment intent created
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post(
    "/create-intent",
    protect,
    createPaymentIntent
);


/**
 * @swagger
 * /api/payments/khqr:
 *   post:
 *     summary: Create KHQR payment
 *     description: Creates a KHQR payment in USD or KHR.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - currency
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 66c123456789
 *               currency:
 *                 type: string
 *                 enum:
 *                   - USD
 *                   - KHR
 *                 example: USD
 *     responses:
 *       201:
 *         description: KHQR created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post(
    "/khqr",
    protect,
    createKHQRPayment
);


/**
 * @swagger
 * /api/payments/khqr/status/{paymentId}:
 *   get:
 *     summary: Check KHQR payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status
 *       404:
 *         description: Order not found
 */
router.get(
    "/khqr/status/:paymentId",
    protect,
    checkKHQRPaymentStatus
);


/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post(
    "/webhook",
    handleStripeWebhook
);

export default router;