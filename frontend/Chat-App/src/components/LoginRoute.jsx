import React from 'react'
import { useStore } from 'zustand'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate } from 'react-router-dom'

const LoginRoute = ({children}) => {
    const {authUser} = useAuthStore()
  return (
    authUser?<Navigate to="/" replace/>:children
  )
}

export default LoginRoute