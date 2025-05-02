import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Outlet, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage'
import Settings from './pages/Settings'
import SignUpPage from './pages/SignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore.js'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const {onlineUsers} = useAuthStore()
  console.log(onlineUsers)
  const { theme } = useThemeStore()
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {//this is calling the ckeckAuth function of the store and 
    checkAuth()
  }, [checkAuth])

  if (!authUser && isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    )
  }

  // console.log({ authUser })

  return (
    <div data-theme={theme}>
      <Navbar>
      </Navbar>
      <Outlet></Outlet>
      <Toaster></Toaster>
    </div>
  )
}

export default App