import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
export const signup = async(req,res)=>{

    const {fullName,email,password}= req.body;
    
    try {
        if(!fullName || !email ||!password)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6)
        {
            return res.status(400).json({message:"Password must be atleast 6 charcters long"});
        }
        

        // checking if email  is valid or not


           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    const user = await User.findOne({email});
    if(user)
    {
        return res.status(400).json({message:"Email already exists"});
    }

    //hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);


    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    })
     
    if(newUser)
    {
        const savedUser=await newUser.save();
         generateToken(savedUser._id,res);
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilepic:newUser.profilepic
        });
        
    }
    else
    {
        res.status(400).json({message:"Invalid user Data"});
    }

    } catch (error) {
        console.log("Error in signup controller",error);
        res.status(500).json({message:"Interval server error"});
    }
}