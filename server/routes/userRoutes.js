import express from "express";

import { protect, admin } from "../middleware/authMiddleware.js";
import { createUser, getUserById, getUsers, updateUser , deleteUser, addAddress, updateAddress, deleteAddress} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(protect,admin,createUser);

router.route("/:id").get(protect,getUserById).put(protect,updateUser).delete(protect, admin, deleteUser);

router.route("/:id/addresses").post(protect, addAddress);
router;

router.route("/:id/addresses/:addressId").put(protect, updateAddress).delete(protect,deleteAddress);


export default router;