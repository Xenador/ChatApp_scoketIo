// Create new file: ProtectedRoute.jsx
import { useAuthStore } from '../store/useAuthStore.js'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthStore()
  return authUser ? children : <Navigate to="/login" replace />
}