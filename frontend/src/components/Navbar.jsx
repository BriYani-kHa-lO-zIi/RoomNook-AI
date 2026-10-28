import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { Home, User, LogOut, Menu, X, Search, MessageSquare, Building, Users } from 'lucide-react'

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-600 font-medium' : 'text-secondary-600'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white ${scrolled ? 'shadow-soft' : ''} transition-all duration-300`}>
      <div className="container">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl bg-primary-50 group-hover:bg-primary-100 transition-colors duration-300">
                <Home className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-xl font-display font-semibold text-secondary-900">
                Room<span className="text-primary-600">Nook</span> AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/pg-listings" className={`flex items-center space-x-1 ${isActive('/pg-listings')} hover:text-primary-600 transition-all duration-200`}>
              <Building className="h-4 w-4" />
              <span>PG Listings</span>
            </Link>
            <Link to="/mess-listings" className={`flex items-center space-x-1 ${isActive('/mess-listings')} hover:text-primary-600 transition-all duration-200`}>
              <span>Mess Listings</span>
            </Link>
            <Link to="/roommate-finder" className={`flex items-center space-x-1 ${isActive('/roommate-finder')} hover:text-primary-600 transition-all duration-200`}>
              <Users className="h-4 w-4" />
              <span>Find Roommates</span>
            </Link>
            <Link to="/compatibility-tester" className={`flex items-center space-x-1 ${isActive('/compatibility-tester')} hover:text-primary-600 transition-all duration-200`}>
              <span>Compatibility</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/chat" className={`flex items-center space-x-1 ${isActive('/chat')} hover:text-primary-600 transition-all duration-200`}>
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Assistant</span>
                </Link>
                <div className="flex items-center pl-4 border-l border-secondary-200">
                  <div className="relative group">
                    <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary-100 transition-all duration-200">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-secondary-800 font-medium">{user?.name?.split(' ')[0]}</span>
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elegant border border-secondary-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <div className="py-1">
                        <Link to="/dashboard" className="flex items-center px-4 py-2 text-secondary-700 hover:bg-secondary-50 hover:text-primary-600">
                          Dashboard
                        </Link>
                        <Link to="/profile" className="flex items-center px-4 py-2 text-secondary-700 hover:bg-secondary-50 hover:text-primary-600">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-secondary-700 hover:bg-secondary-50 hover:text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-outline py-1.5 px-4 rounded-xl">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary py-1.5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-primary-600 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-elegant border-t border-secondary-100 animate-fadeIn">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/pg-listings"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building className="h-5 w-5" />
                <span>PG Listings</span>
              </Link>
              <Link
                to="/mess-listings"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Mess Listings</span>
              </Link>
              <Link
                to="/roommate-finder"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Find Roommates</span>
              </Link>
              <Link
                to="/compatibility-tester"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Compatibility Test</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Assistant</span>
                  </Link>
                  <div className="mt-2 pt-2 border-t border-secondary-100">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-secondary-900 font-medium">{user?.name}</span>
                        <span className="text-secondary-500 text-sm">{user?.email}</span>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-xl text-secondary-700 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-2 pt-2 border-t border-secondary-100 px-3 py-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full btn btn-outline text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full btn btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
