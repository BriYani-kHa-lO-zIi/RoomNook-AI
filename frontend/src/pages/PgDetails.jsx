import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Star, Wifi, Car, Utensils, Droplets, Zap, Shield, Phone, Calendar, Heart, Share2 } from 'lucide-react'

const PgDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Sample PG data - in real app, this would come from API
  const pgData = {
    id: 1,
    title: "Modern PG Clement Town",
    location: "Clement Town, Dehradun",
    rating: 4.5,
    totalReviews: 127,
    price: 5500,
    roomType: "Double Sharing",
    gender: "Unisex",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
    ],
    amenities: [
      { name: "WiFi", icon: Wifi, available: true },
      { name: "AC", icon: Zap, available: true },
      { name: "RO Water", icon: Droplets, available: true },
      { name: "Parking", icon: Car, available: true },
      { name: "Food", icon: Utensils, available: true },
      { name: "Security", icon: Shield, available: true }
    ],
    description: "Modern PG Clement Town offers comfortable and affordable accommodation for students and working professionals. Located in a prime area with excellent connectivity to major tech parks and educational institutions.",
    rules: [
      "No smoking inside rooms",
      "No loud music after 10 PM",
      "Guests allowed only in common areas",
      "Monthly rent to be paid before 5th of every month",
      "Security deposit equivalent to 2 months rent"
    ],
    owner: {
      name: "Mrs. Sharma",
      phone: "+91 9876543210",
      responseRate: "95%",
      responseTime: "Within 1 hour",
      avatar: "M"
    },
    perfectMatchScore: 87
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'reviews', label: 'Reviews' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative">
                <img 
                  src={pgData.images[currentImageIndex]} 
                  alt={pgData.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {pgData.images.length}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {pgData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? 'border-teal-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${pgData.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PG Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{pgData.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{pgData.location}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-semibold">{pgData.rating}</span>
                      <span className="text-gray-500 ml-1">({pgData.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-1" />
                      <span>{pgData.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹{pgData.price.toLocaleString()}</div>
                  <div className="text-gray-500">per month</div>
                </div>
              </div>

              {/* Perfect Match Score */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Perfect Match Score™</h3>
                    <p className="text-yellow-100">Based on your preferences and compatibility</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white">{pgData.perfectMatchScore}%</div>
                    <div className="text-yellow-100 text-sm">Excellent Match</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About this PG</h3>
                    <p className="text-gray-700 mb-6">{pgData.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-4">PG Rules</h3>
                    <ul className="space-y-2">
                      {pgData.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pgData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <amenity.icon className={`h-5 w-5 mr-3 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-medium ${amenity.available ? 'text-gray-900' : 'text-gray-500'}`}>
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'rooms' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Room Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{pgData.roomType}</h4>
                      <p className="text-gray-700">Comfortable and well-furnished rooms with all necessary amenities.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Location</h3>
                    <p className="text-gray-700 mb-4">{pgData.location}</p>
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Map would be integrated here</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-4">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-semibold">5.0</span>
                          </div>
                          <span className="text-gray-600">Rahul S.</span>
                          <span className="text-gray-400 ml-2">2 weeks ago</span>
                        </div>
                        <p className="text-gray-700">Great place to stay! Clean rooms, good food, and friendly staff.</p>
                      </div>
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-4">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-semibold">4.0</span>
                          </div>
                          <span className="text-gray-600">Priya M.</span>
                          <span className="text-gray-400 ml-2">1 month ago</span>
                        </div>
                        <p className="text-gray-700">Good location and facilities. Would recommend to others.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Owner Information</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {pgData.owner.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{pgData.owner.name}</h4>
                  <p className="text-gray-600">{pgData.owner.phone}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response rate:</span>
                  <span className="font-medium">{pgData.owner.responseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response time:</span>
                  <span className="font-medium">{pgData.owner.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-teal-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Interested in this PG?</h3>
              <p className="text-gray-600 mb-6">Contact the owner directly or schedule a visit</p>
              
              <div className="space-y-3">
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Owner
                </button>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Visit
                </button>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PgDetails
