import express from "express";
import { signup ,login, logout,updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import arcjet from "@arcjet/node";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
// import User from "../models/User.js";
const router = express.Router();


router.use(arcjetProtection);
//some api endpoints
router.post("/signup",signup);

router.post("/login",login);
 
router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,(req,res)=>{
    return res.status(200).json(req.user)
})
 

export default router;