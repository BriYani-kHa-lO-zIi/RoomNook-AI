import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ChatBot from './components/ChatBot'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PgListings from './pages/PgListings'
import PgDetails from './pages/PgDetails'
import MessListings from './pages/MessListings'
import RoommateListings from './pages/RoommateListings'
import RoommateFinder from './pages/RoommateFinder'
import CompatibilityTester from './pages/CompatibilityTester'
import PerfectMatchScore from './pages/PerfectMatchScore'
import ChatAssistant from './pages/ChatAssistant'
import Profile from './pages/Profile'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pg-listings" element={<PgListings />} />
          <Route path="/pg-details/:id" element={<PgDetails />} />
          <Route path="/mess-listings" element={<MessListings />} />
          <Route path="/roommate-listings" element={<RoommateListings />} />
          <Route path="/roommate-finder" element={<RoommateFinder />} />
          <Route path="/compatibility-tester" element={<CompatibilityTester />} />
          <Route path="/perfect-match-score" element={<PerfectMatchScore />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'student' ? <StudentDashboard /> : 
               user?.role === 'owner' ? <OwnerDashboard /> : 
               user?.role === 'admin' ? <AdminDashboard /> : <Home />}
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatAssistant />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  )
}

export default App
