import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationPage from './pages/NotificationPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import  { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import axios from 'axios'
import { axiosInstance } from './lib/axios.js'
import PageLoader from './components/PageLoader.jsx'
import { getAuthUser } from './lib/api.js'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'

function App() {
  const{isLoading,authUser}= useAuthUser()

  const [data,setData]=useState()
  const {theme}=useThemeStore()



  const isAuthenticated=Boolean(authUser)
  const isOnboarded=authUser?.isOnboarded

 
if(isLoading)
  return <PageLoader/>


  return (
 <div className='h-screen' data-theme={theme}>
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated
              ? (isOnboarded ? (<>
              
              <Layout showSidebar={true}>

              <HomePage />
              </Layout>
              </>
              ) : <Navigate to="/onboarding" />)
              : <Navigate to="/login" />
          }
        />

<Route
  path="/notifications"
  element={isAuthenticated&& isOnboarded ? (<>
  <Layout showSidebar>

  <NotificationPage />
  </Layout>
  </>) : <Navigate to={!isAuthenticated?"/login":"/onboarding"} />}
/>

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />}
        />
        <Route
          path="/onboarding"
          element={isAuthenticated ?( !isOnboarded ? <OnboardingPage /> :<Navigate to="/"/>): <Navigate to="/login" />}
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated && isOnboarded ? (<Layout showSidebar={false}><ChatPage /></Layout>) : <Navigate to={!isAuthenticated ?"login":"onbaording"} />}
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnboarded? <CallPage /> : <Navigate to={!isAuthenticated ?"/login":"/onboarding"}/>}
        />
      </Routes>
      <Toaster />
    </div>

  )
}

export default App
