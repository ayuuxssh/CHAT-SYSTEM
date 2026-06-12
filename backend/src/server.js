import "dotenv/config"
import express from "express";
import path  from 'path';
import cors from "cors"
import {app,server} from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import authRoutes  from "./routes/auth.routes.js";
import messageRoutes  from "./routes/message.routes.js";
connectDB();
const PORT =  process.env.PORT;

const __dirname = path.resolve();
app.use(cookieParser());
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//for auth routes
app.use("/api/auth",authRoutes);//classic use of routes
//for implementing message routes
app.use("/api/message",messageRoutes);

//make ready for deployment

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(frontendPath));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}
server.listen((PORT),()=>{
console.log(`Application is runnnig  in ${PORT}`);
})