import React, { useState } from 'react'
import { Star, MapPin, Users, Home, TrendingUp, Award, Target, CheckCircle } from 'lucide-react'

const PerfectMatchScore = () => {
  const [userPreferences, setUserPreferences] = useState({
    location: '',
    budget: [3000, 10000],
    roomType: 'double',
    facilities: [],
    lifestyle: {
      smoking: false,
      pets: false,
      noiseLevel: 'moderate',
      cleanliness: 'high'
    }
  })

  const [matchResults, setMatchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  // Sample PG data with compatibility scores
  const samplePgs = [
    {
      id: 1,
      title: "Modern PG Clement Town",
      location: "Clement Town, Dehradun",
      price: 5500,
      roomType: "Double",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food", "Security"],
      perfectMatchScore: 87,
      breakdown: {
        location: 90,
        budget: 85,
        facilities: 88,
        lifestyle: 85
      },
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Comfort Zone PG",
      location: "Rajpur Road, Dehradun",
      price: 7500,
      roomType: "Single",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food"],
      perfectMatchScore: 72,
      breakdown: {
        location: 75,
        budget: 60,
        facilities: 80,
        lifestyle: 75
      },
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Student Hub PG",
      location: "Dharampur, Dehradun",
      price: 4000,
      roomType: "Triple",
      facilities: ["WiFi", "RO Water", "Food", "Security"],
      perfectMatchScore: 95,
      breakdown: {
        location: 95,
        budget: 100,
        facilities: 90,
        lifestyle: 95
      },
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    }
  ]

  const calculateMatchScore = () => {
    // Simulate match score calculation based on user preferences
    const results = samplePgs.map(pg => {
      let score = 0
      let breakdown = {
        location: 0,
        budget: 0,
        facilities: 0,
        lifestyle: 0
      }

      // Location score (simplified)
      if (userPreferences.location && pg.location.toLowerCase().includes(userPreferences.location.toLowerCase())) {
        breakdown.location = 90
      } else {
        breakdown.location = 70
      }

      // Budget score
      if (pg.price >= userPreferences.budget[0] && pg.price <= userPreferences.budget[1]) {
        breakdown.budget = 100
      } else if (pg.price < userPreferences.budget[0]) {
        breakdown.budget = 80
      } else {
        breakdown.budget = 60
      }

      // Facilities score
      const facilityMatch = userPreferences.facilities.filter(facility => 
        pg.facilities.includes(facility)
      ).length
      breakdown.facilities = (facilityMatch / Math.max(userPreferences.facilities.length, 1)) * 100

      // Lifestyle score (simplified)
      breakdown.lifestyle = 85

      // Calculate overall score
      score = Math.round(
        (breakdown.location * 0.3) +
        (breakdown.budget * 0.3) +
        (breakdown.facilities * 0.25) +
        (breakdown.lifestyle * 0.15)
      )

      return {
        ...pg,
        perfectMatchScore: score,
        breakdown
      }
    }).sort((a, b) => b.perfectMatchScore - a.perfectMatchScore)

    setMatchResults(results)
    setShowResults(true)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Perfect Match Score™</h1>
        <p className="text-gray-600">Find your ideal PG based on compatibility scoring</p>
      </div>

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preferences Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <input
                  type="text"
                  value={userPreferences.location}
                  onChange={(e) => setUserPreferences({...userPreferences, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter location (e.g., Clement Town)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="2000"
                    max="15000"
                    value={userPreferences.budget[0]}
                    onChange={(e) => setUserPreferences({
                      ...userPreferences, 
                      budget: [parseInt(e.target.value), userPreferences.budget[1]]
                    })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="text-sm text-gray-600 min-w-[100px] text-center">
                    ₹{userPreferences.budget[0].toLocaleString()} - ₹{userPreferences.budget[1].toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="15000"
                    value={userPreferences.budget[1]}
                    onChange={(e) => setUserPreferences({
                      ...userPreferences, 
                      budget: [userPreferences.budget[0], parseInt(e.target.value)]
                    })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={userPreferences.roomType}
                  onChange={(e) => setUserPreferences({...userPreferences, roomType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Facilities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['WiFi', 'AC', 'RO Water', 'Parking', 'Food', 'Security'].map((facility) => (
                    <label key={facility} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userPreferences.facilities.includes(facility)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserPreferences({
                              ...userPreferences,
                              facilities: [...userPreferences.facilities, facility]
                            })
                          } else {
                            setUserPreferences({
                              ...userPreferences,
                              facilities: userPreferences.facilities.filter(f => f !== facility)
                            })
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={calculateMatchScore}
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Calculate Perfect Match Score
            </button>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">How Perfect Match Score™ Works</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-teal-100 p-2 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location Compatibility</h3>
                  <p className="text-gray-600 text-sm">Proximity to your preferred area and connectivity</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Budget Alignment</h3>
                  <p className="text-gray-600 text-sm">How well the price fits your budget range</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Facility Match</h3>
                  <p className="text-gray-600 text-sm">Availability of your required amenities</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Lifestyle Compatibility</h3>
                  <p className="text-gray-600 text-sm">Rules, environment, and living conditions</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
              <div className="flex items-center">
                <Award className="h-6 w-6 mr-2" />
                <div>
                  <h3 className="font-semibold">Perfect Match Algorithm</h3>
                  <p className="text-sm text-yellow-100">Our proprietary scoring system analyzes multiple factors to find your ideal match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Your Perfect Matches</h2>
                <p className="text-gray-600">Based on your preferences and compatibility analysis</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Modify Preferences
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {matchResults.map((pg, index) => (
              <div key={pg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <img
                        src={pg.image}
                        alt={pg.title}
                        className="w-24 h-24 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{pg.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{pg.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{pg.roomType} • ₹{pg.price.toLocaleString()}/month</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {pg.facilities.slice(0, 4).map((facility, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(pg.perfectMatchScore)}`}>
                        <Star className="h-4 w-4 mr-1" />
                        {pg.perfectMatchScore}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{getScoreLabel(pg.perfectMatchScore)}</p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{pg.breakdown.location}%</div>
                      <div className="text-xs text-gray-600">Location</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{pg.breakdown.budget}%</div>
                      <div className="text-xs text-gray-600">Budget</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{pg.breakdown.facilities}%</div>
                      <div className="text-xs text-gray-600">Facilities</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{pg.breakdown.lifestyle}%</div>
                      <div className="text-xs text-gray-600">Lifestyle</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfectMatchScore
