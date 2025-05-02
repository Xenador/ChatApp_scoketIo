import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!email || !fullName || !password) {
            res.status(400).json({ message: "All feilds are required!!" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be of atleast 6 characters" })
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists" })

        const salt = await bcrypt.genSalt(10)//this is the salt we use 10 as convention here this will encrypt the password given by the user to save in database
        const hashedPassword = await bcrypt.hash(password, salt)

        //now save these things in the database
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            //Now create a JWT token 
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ message: "Invalid User" })
        }

    } catch (error) {
        console.log("Erron in SignUp contoller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) res.status(400).json({ message: "Invalid Credentials" })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) res.status(400).json({ message: "Invalid Credentials" })

        generateToken(user._id, res)

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            password: user.password,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in Login controller", error)
        res.status(500).json({ message: "Internal server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(201).json({ message: "Logout Sucssessful" })
    } catch (error) {
        console.log("Error in Logout controller", error)
        res.status(500).json({ message: "Internal server Error" })
    }
}

export const updateProfile = async (req,res)=>{
    //we will be using the cloudnery service for uploading the image to profile picture
    try {
        const {profilePic} = req.body
        const userId = req.user._id//kuki udpate profile contoller is called next to protected route and we know that we have bind the req with the user
        if(!profilePic) return res.status(400).json({message:"Profile pic is required"})
        const uploadResponse = await cloudinary.uploader.upload(profilePic) 
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update profile picture")
        res.status(500).json({message:"Internal server error"})
    }
}

export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user)//this function basically to authenticate user if page is refreshed this will navigate to login or to porfile page
    } catch (error) {
        console.log("error in checkAuth controller")
        res.status(500).json({message:"Internal server error"})
    }
}