
import Message from "../models/Message.js"
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllContacts = async(req,res)=>{


    try {

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");


        res.status(200).json(filteredUsers);

        
    } catch (error) {
        console.log("Error in getAllContacts:",error);
        res.status(500).json({message:"Server error"});
    }
}


export const getMessageByUserId = async(req,res)=>{

    try {
        const myId = req.user._id;
        const {id:userToChatId}=req.params;


        const message = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        });

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessageById",error);
        res.status(500).json({message:"Internal Server Error"});
    } 
}

export const sendMessage = async(req,res)=>{


    try {
        const {text,image} = req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image)
        {

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });
     await newMessage.save();

     //todo send message in real time 

     res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage",error);
        res.status(500).json({message:"Interval Server Error"});
    }
}


export const getChartPartners= async(req,res)=>{
    try {
        const loggedInUserId= req.user._id;

        //find all the messages where the logged in user in either sender or receiver

        const messages = await Message.find({
            $or:[{
                senderId:loggedInUserId
            },
            {receiverId:loggedInUserId}
        ]
        });

        const chatPartnerId = [...new Set(messages.map(msg=>{
            msg.senderId.toString() === loggedInUserId.toString()?msg.receiverId.toString():msg.senderId.toString()
        }))];

        const chatPartner = await User.find({_id: {$in:chatPartnerId}}).select("-password");

        res.status(200).json(chatPartner);
    } catch (error) {
        console.log("Error in getChatPartners",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}