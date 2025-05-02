import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controllers.js'
import { protectedRoute } from '../middlewares/auth.midleware.js'

const router = express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/updateprofile",protectedRoute,updateProfile)

router.get("/check",protectedRoute,checkAuth)

export default router;