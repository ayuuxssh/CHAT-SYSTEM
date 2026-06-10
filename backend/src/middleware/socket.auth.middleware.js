
import "dotenv/config"
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookie from "cookie";

export const socketAuthMiddleware = async(socket,next)=>{

    try {
         // extract the token from http-only cookies
const cookies = cookie.parse(
  socket.handshake.headers.cookie || ""
);

const token = cookies.jwt;
         if(!token)
         {
            console.log("Socket Connection rejected: Invalid token");
            return next(new Error("Unauthorized - No Token Provided"));
         }
         //verify the token

         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         if(!decoded)
         {
            console.log("Socket Connection rejected: Invalid Token");
            return next(new Error("Unauthorized - No Token Provided"));
         }


            const user = await User.findById(decoded.userId).select("-password");  //select everything but not password
             if(!user)
             {
                console.log("Socket Connection rejected : User not found");
                return next(new Error("User not found"));
             }

             //attach user info in socket
             socket.user = user;
             socket.userId= user._id.toString();
             console.log(`Socket authenticated for user :${user.fullName}  (${user._id})`);
             next();
         } catch (error) {
             console.error("Error in Socket Authentication:",error.message);
             next(new Error("Unauthorized-Authentication failed"));
         }
};