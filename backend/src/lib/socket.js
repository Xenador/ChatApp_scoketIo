import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    },
})

const userSocketMap = {}//this will basically store the online users {userId:socketId} this userId will be coming from the database and the socketId will be of the connected socket 

export function getReceiverSocketId(userId){
    return userSocketMap[userId]//this will return us the socketId of the reciever its a helper function
}

io.on("connection",(socket)=>{//we are actually trying to listen any incoming connection
    console.log("User has connected",socket.id)
    const userId = socket.handshake.query.userId//hame fronend se current user ki id query ki form mai milegi
    if(userId) userSocketMap[userId]  = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))//this is used to send events to all the connected clients

    socket.on("disconnect",()=>{
        console.log("A user is disconnected",socket.id)//listening to the event when the user disconnects
        delete userSocketMap[userId]//here basically when the user diconnects will get removed from the socket map
        io.emit("getOnlineUsers",Object.keys(userSocketMap))//imforming other usrs that the user has become offline

    })
})



export {io,app,server}