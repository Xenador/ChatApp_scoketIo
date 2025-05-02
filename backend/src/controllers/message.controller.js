import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId} from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id//because this is a protected route 
        const filteredUsers = await User.find({ _id: { $ne: LoggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("error in getUsersForSidebar",error)
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export const getMessages = async (req, res) => {
    try {
        const { id: anotherUserId } = req.params//yaha par userToChat id is the id of another user getting through params
        const myId = req.user._id
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:anotherUserId},
                {senderId:anotherUserId,receiverId:myId}
            ]
        }
        )
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessagesController",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id
        let imageURL
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url 
        }
        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image: imageURL
        })
        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){//here we are chekcking if the user exists 
            io.to(receiverSocketId).emit("newMessage",newMessage)//here actually sending realtime new message to the reciever
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessageController",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}