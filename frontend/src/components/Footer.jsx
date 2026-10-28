import React from 'react'
import { Home, MessageCircle, Users, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">RoomNook AI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Smart PG, Roommate & Mess Finder for Students. Find your perfect match with our AI-powered compatibility system.
            </p>
            <div className="flex space-x-4">
              <MessageCircle className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Users className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <MapPin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/pg-listings" className="text-gray-300 hover:text-blue-400 transition-colors">PG Listings</a></li>
              <li><a href="/mess-listings" className="text-gray-300 hover:text-blue-400 transition-colors">Mess Listings</a></li>
              <li><a href="/chat" className="text-gray-300 hover:text-blue-400 transition-colors">AI Assistant</a></li>
              <li><a href="/register" className="text-gray-300 hover:text-blue-400 transition-colors">Register</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 RoomNook AI. All rights reserved. Built with ❤️ for students.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
