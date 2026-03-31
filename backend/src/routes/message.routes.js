import express  from "express";
const router = express.Router();

//some api endpoints
router.get("/send",(req,res)=>{
    res.send("Send Message endpoint");

})

export default router;