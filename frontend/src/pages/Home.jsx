import React from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, Users, MessageCircle, Star, Shield, Zap } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-28 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-[5%] w-80 h-80 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600 opacity-10 blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20 shadow-soft">
              <span className="w-2 h-2 bg-accent-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Matching System
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Find Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                RoomNook
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              The smartest way to find verified PGs, compatible roommates, and perfect mess services using our AI-powered Perfect Match Score™ system
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
              <Link to="/register" className="btn btn-accent text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-elegant transform hover:scale-105 transition-all duration-300">
                Get Started Free
              </Link>
              <Link to="/pg-listings" className="btn bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-8 py-4 rounded-xl font-semibold border border-white/20 transition-all duration-300 shadow-soft">
                Browse PGs
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Verified PGs</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm text-white/80">Happy Students</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-white/80">Match Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-medium mb-2 block">POWERFUL FEATURES</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
              Why Choose RoomNook AI?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We use advanced AI to match you with the perfect living situation based on your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white border border-secondary-100 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary-900 text-center">Perfect Match Score™</h3>
              <p className="text-secondary-600 leading-relaxed text-center">
                Our advanced AI calculates compatibility scores for PG, roommate, and mess combinations using machine learning algorithms
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-secondary-100 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary-900 text-center">Verified Listings</h3>
              <p className="text-secondary-600 leading-relaxed text-center">
                All PG and mess listings are thoroughly verified by our admin team to ensure authenticity and quality
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white border border-secondary-100 shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-secondary-900 text-center">AI Assistant</h3>
              <p className="text-secondary-600 leading-relaxed text-center">
                Chat with our intelligent AI assistant to get personalized recommendations based on your preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to find your perfect living situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and tell us about your preferences, budget, and lifestyle
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Matching</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and finds compatible PGs and roommates
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized recommendations with Perfect Match Scores™
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect & Book</h3>
              <p className="text-gray-600">
                Contact owners, meet roommates, and book your perfect space
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Verified PGs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-200">Mess Options</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect RoomNook?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who found their ideal living situation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Start Your Journey
            </Link>
            <Link to="/chat" className="btn btn-secondary text-lg px-8 py-3">
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
