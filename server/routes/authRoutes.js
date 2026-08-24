import express from "express";
import { registerUser } from "../controllers/authController.js";


const router = express.Router();

// register route
router.post("/register", registerUser)

// login route
router.post("/login", loginUser)

// router.get("/login",(req,res)=> {
//     res.send("login is working");
// });

export default router;