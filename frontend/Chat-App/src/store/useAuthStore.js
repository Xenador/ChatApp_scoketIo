import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,//this is the loading state
    onlineUsers: [],
    socket: null,//this is socket state


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })//backend se user ko send kia chack wale route ke through or axios instance se fetch krkr yaha par authorised user ko set krdia
            get().connectSocket()//this is connect socket mathod it will connect the user the socket server running in real time
        } catch (error) {
            console.log("error in the checkAuth axios", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully!")
            get().connectSocket()//this is connect socket mathod it will connect the user the socket server running in real time
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            get().disconnectSocket()//this is disconnect socket mathod when user logout we will disconnect from the socket server
            toast.success("Logout Successfully!!")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Login Successfull")
            get().connectSocket()//this is connect socket mathod it will connect the user the socket server running in real time 
        } catch (error) {
            toast.error(error.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    connectSocket: async () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return// if user is not authorised or the socket is already connected than no need to do anyhting  
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,//here we are sending the current user's id to update the socket map
            }
        })//here connecting the base or server(backend) to socket in clientside

        socket.connect()
        set({ socket: socket })
        socket.on("getOnlineUsers", (userIds) => {//here with this getOnlineUsers we are updating the onlineUsers array to active users  
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket.disconnect()
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            console.log("hi")
            const res = await axiosInstance.put("/auth/updateprofile", data)
            set({ authUser: res.data })
            toast.success("Profile Updated Successfully!")

        } catch (error) {
            console.log("Error in update Profile(store)", error)
            toast.error(error.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}))    