import express from "express";
import { signup ,login, logout} from "../controllers/auth.controller.js";

const router = express.Router();

//some api endpoints
router.post("/signup",signup);

router.post("/login",login);
 
router.post("/logout",logout);

router.get("/update",(req,res)=>{
    res.send("Update endpoint");
})



export default router;