const express = require("express");
const dotenv = require("dotenv");
const app = express();

const authRoutes = require("./routes/auth.routes.js");
const messageRoutes = require("./routes/message.routes.js");

dotenv.config();
const PORT =  process.env.PORT;
app.use(express.json());
//for auth routes
app.use("/api/auth",authRoutes);//classic use of routes
//for implementing message routes
app.use("/api/message",messageRoutes);



app.listen((PORT),()=>{
console.log(`Application is runnnig  in ${PORT}`);
})