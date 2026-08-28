import express from "express";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistProducts,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUserWishlist);
router.route("/add").post(protect, addToWishlist);
router.route("/remove").delete(protect, removeFromWishlist);
router.route("/product").post(protect, getWishlistProducts);
router.route("/clear").delete(protect, clearWishlist);

export default router;