import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, //MS
        httpOnly:true,//prevent XSS attack and cross-site scripting attack
        sameSite:"strict",//CSRF attack and crossite request forgery attacks are prevented
        secure:process.env.NODE_ENV !=="developement"//this will basically switch between the http for dev and https for the prod phase 
    })//here we are actually sending our jwt tokens through cookies 
    return token
}