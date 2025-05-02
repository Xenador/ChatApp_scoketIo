import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) return res.status(401).json({ message: "Unauthorised - No token provided" })
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //verify the token inside the cookie
        if (!decoded) return res.status(401).json({ message: "Unauthorised-vrification failed" })
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) res.status(401).json({ message: 'Unauthorised-User does not exists' })
        req.user = user//here we are binding the req with the user 
        next()
    } catch (error) {
        console.log("error in authorisation middleware",error.message)
        res.status(500).json({message:"Internal Server Error!!"})
    }
}