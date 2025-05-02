import express from 'express'
import { protectedRoute } from '../middlewares/auth.midleware.js'
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js'

const router = express.Router()

router.get("/users",protectedRoute,getUsersForSidebar)//this route will fetch the users for the sidebar

router.get("/message/:id",protectedRoute,getMessages)//in this id as params we are actually send the userid of the another person 

router.post("/send/:id",protectedRoute,sendMessage)
export default router