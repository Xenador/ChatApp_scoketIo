import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import Settings from './pages/Settings.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import SignUpRoute from './components/SignUpRoute.jsx'
import LoginRoute from './components/LoginRoute.jsx'
let router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App></App>, //lets create the children routes
      children: [
        {
          path: "/",
          element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>)
        },
        {
          path: "/login",
          element: <LoginRoute><LoginPage/></LoginRoute>
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
          <ProfilePage/>
          </ProtectedRoute>)
        },
        {
          path: "/settings",
          element: <ProtectedRoute>
            <Settings/>
            </ProtectedRoute>
        },
        {
          path: "/signup",
          element: <SignUpRoute><SignUpPage/></SignUpRoute>
        }
      ]
    }
  ])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)
