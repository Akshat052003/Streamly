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
import PageLoader from './components/PageLoader'
import { getAuthUser } from './lib/api'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {isLoading, authUser} = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  const {theme} = useThemeStore()
  
  if(isLoading) return <PageLoader/>
  return (
    <div className='h-screen' data-theme = {theme}>
      
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}>
          <HomePage/>
        </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />
        <Route path='/signup' element={!isAuthenticated ? <Signup/> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path='/login' element={!isAuthenticated ? <Login/> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path='/notifications' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}>
          <NotificationsPage/>
        </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />

        <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={false}><ChatPage/></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />
        
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (<CallPage/>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)} />
      </Routes>
      <Toaster/>

    </div>
  )
}

export default App