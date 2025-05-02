import axios from "axios"
import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            console.log('Error in getUsers(store)', error)
            toast.error(error.response)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/message/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            console.log("Error in fetching the user's messages", error)
            toast.error(error.response)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (data) => {
        let { selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data)
            set({ messages: [...messages, res.data] })
        } catch (error) {
            console.log(`error in send message axios(chat store)`, error)
            toast.error(error.response)
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if(!isMessageSentFromSelectedUser) return
            set({ messages: [...get().messages, newMessage] })
        })

    },

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user })
    }
}))
