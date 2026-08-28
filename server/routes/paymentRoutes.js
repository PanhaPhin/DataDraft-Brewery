import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createPaymentIntent,
    handleStripeWebhook,
    createKHQRPayment,
    checkKHQRPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment APIs including Stripe and KHQR/Bakong
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     CreatePaymentIntentRequest:
 *       type: object
 *       required:
 *         - amount
 *         - currency
 *       properties:
 *         amount:
 *           type: number
 *           description: Payment amount in the smallest currency unit.
 *           example: 2500
 *         currency:
 *           type: string
 *           example: usd
 *
 *     CreateKHQRPaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           description: Payment amount.
 *           example: 25.50
 *         currency:
 *           type: string
 *           enum:
 *             - USD
 *             - KHR
 *           example: USD
 *         orderId:
 *           type: string
 *           description: Order associated with this payment.
 *           example: ORD-20260828-001
 *
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Payment created successfully
 *         data:
 *           type: object
 *
 *     KHQRResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: KHQR payment created successfully
 *         data:
 *           type: object
 *           properties:
 *             paymentId:
 *               type: string
 *               example: 66cf123456789
 *             orderId:
 *               type: string
 *               example: ORD-20260828-001
 *             amount:
 *               type: number
 *               example: 25.50
 *             currency:
 *               type: string
 *               example: USD
 *             qr:
 *               type: string
 *               description: KHQR string to generate/display as a QR code.
 *               example: 00020101021229370016ABA...
 *             status:
 *               type: string
 *               enum:
 *                 - pending
 *                 - paid
 *                 - failed
 *               example: pending
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create Stripe payment intent
 *     description: Creates a Stripe PaymentIntent for the authenticated user.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentIntentRequest'
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid payment data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 *     description: Creates a KHQR/Bakong payment and returns the KHQR string that can be displayed as a QR code for the customer to scan using a supported banking app.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateKHQRPaymentRequest'
 *     responses:
 *       201:
 *         description: KHQR payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KHQRResponse'
 *       400:
 *         description: Invalid KHQR payment data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 *     description: Checks whether a KHQR/Bakong payment has been completed.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: KHQR payment ID.
 *         example: 66cf123456789
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
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
 *                     paymentId:
 *                       type: string
 *                       example: 66cf123456789
 *                     status:
 *                       type: string
 *                       enum:
 *                         - pending
 *                         - paid
 *                         - failed
 *                       example: paid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
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
 *     description: Receives Stripe webhook events. This endpoint must not use the normal JWT authentication middleware.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe webhook event payload.
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Invalid webhook signature or payload
 */
router.post(
    "/webhook",
    handleStripeWebhook
);

export default router;
