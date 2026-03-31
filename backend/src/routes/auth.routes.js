import express from "express";

const router = express.Router();

//some api endpoints
router.get("/signup",(req,res)=>{
    res.send("Signup endpoint");

})
router.get("/login",(req,res)=>{
  res.send("Login Endpoint");
})
router.get("/logout",(req,res)=>{
 res.send("Logout Endpoint");
})
router.get("/update",(req,res)=>{
    res.send("Update endpoint");
})



export default router;