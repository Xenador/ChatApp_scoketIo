import mongoose from 'mongoose'
import { Schema } from 'yup'
const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        fullName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        profilePic:{
            type:String,
            default:"",
        }
    },
    {timestamps:true}
);
const User = mongoose.model("User",userSchema)//the name we are giving User in the model will be saved as users in the database so it is a good pracice to give in singular with firat letter as capital
export default User