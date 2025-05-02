import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './lib/db.js'
import messageRoutes from './routes/message.routes.js'
import { app, server } from './lib/socket.js'
import path from 'path'

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve()
app.use(cors({//actually cors is blocking our frontend axios to acssess the backend hence this will tell cors to allow our frontend to acssses the backend
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())//as the cookies have the jwt in the encoded format so we need this cookie parser in order to get the jwt in decoded format 
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/Chat-App/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/Chat-App/dist", "index.html"));
    });
}

server.listen(PORT, () => {
    connectDB()
    console.log('Server is running at ' + PORT)
})