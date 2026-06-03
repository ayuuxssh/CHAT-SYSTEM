import jwt from "jsonwebtoken"
import "dotenv/config"
import User from "../models/User.js"


export const protectRoute = async(req,res,next)=>{
try {
    const token = req.cookies.jwt;
    // console.log(token);
    if(!token)
    {
        return res.status(401).json({message:"Unauthorized - No token provided"});
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded)
    {
        return res.status(401).json({message:" Unauthorised - Invalid Token"})
    }
    const user = await User.findById(decoded.userId).select("-password");  //select everything but not password
    if(!user)
    {
        return res.status(404).json({message:"User not found"});
    }
    req.user = user;
    next();
} catch (error) {
    console.error("Error in protectroute middleware:",error);
    res.status(500).json({message:"Internal Server Error"})
}
};