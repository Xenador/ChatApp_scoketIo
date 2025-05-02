import {v2 as cloudinary} from 'cloudinary'//HERE WE ARE CONFIGURING THE CLOUDINARY FOR UPLOADING IMAGES FOR PROFILE SECTION FROM ENVIRONMENT VARIABLES
import { config } from 'dotenv'
config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
export default cloudinary