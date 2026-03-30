const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT =  process.env.PORT;
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Hello Welcome to the Sever");
})
app.listen((PORT),()=>{
console.log(`Application is runnnig  in ${PORT}`);
})