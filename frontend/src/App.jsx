import React from 'react'
import { data, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import OnboardingPage from './pages/OnboardingPage'
import NotificationsPage from './pages/NotificationsPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'

const App = () => {
  const {data : authData, isLoading, error} = useQuery({
    queryKey : ["authUser"],
    queryFn : async() => {
      const res = await axiosInstance.get("/auth/me")
      return res.data
    },
    retry:false
  })
  const authUser = authData?.user
  return (
    <div className='h-screen' data-theme = "dark">
      
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/" />} />
        <Route path='/onboarding' element={authUser ? <OnboardingPage/> : <Navigate to="/login" />} />
        <Route path='/notifications' element={authUser ? <NotificationsPage/> : <Navigate to="/login" />} />
        <Route path='/chat' element={authUser ? <ChatPage/> : <Navigate to="/login" />} />
        <Route path='/call' element={authUser ? <CallPage/> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>

    </div>
  )
}

export default App