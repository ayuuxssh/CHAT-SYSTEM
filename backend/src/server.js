import express from "express";
import dotenv  from "dotenv";
import path  from 'path';
const app = express();

import authRoutes  from "./routes/auth.routes.js";
import messageRoutes  from "./routes/message.routes.js";

dotenv.config();
const PORT =  process.env.PORT;

const __dirname = path.resolve();
app.use(express.json());
//for auth routes
app.use("/api/auth",authRoutes);//classic use of routes
//for implementing message routes
app.use("/api/message",messageRoutes);

//make ready for deployment

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
app.get((req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
})
}
app.listen((PORT),()=>{
console.log(`Application is runnnig  in ${PORT}`);
})