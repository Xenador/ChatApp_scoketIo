import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Navigate } from 'react-router-dom'
const SignUpRoute = ({children}) => {
    const { authUser } = useAuthStore()
  return (
    authUser? <Navigate to="/" replace/>:children
  )
}

export default SignUpRoute