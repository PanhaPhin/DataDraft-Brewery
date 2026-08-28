import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Not authorized
 */
router.route("/").get(getCart).post(addItemToCart).delete(clearCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to update
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found in cart
 */
router.route("/update").put(updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from the cart
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found in cart
 */
router.route("/:productId").delete(removeItemFromCart);

export default router;