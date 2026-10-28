import React, { useState, useEffect } from 'react'
import { MapPin, CalendarDays, Users, Search, Filter, Star, Heart, MessageCircle, UserCheck } from 'lucide-react'
import Slider from '../components/Slider'

const RoommateFinder = () => {
  const [filters, setFilters] = useState({
    location: '',
    gender: 'All',
    ageRange: [18, 40],
    budgetRange: [3000, 15000],
    occupation: '',
    lifestyle: '',
    cleanliness: ''
  })
  const [filteredRoommates, setFilteredRoommates] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Sample roommate data
  const sampleRoommates = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 24,
      gender: "Female",
      occupation: "Software Engineer",
      description: "Looking for a clean and quiet PG or flatshare. I work at a tech company and have regular 9-5 hours. I enjoy reading and occasional weekend outings.",
      preferences: ["Non-smoker", "Vegetarian friendly", "Pet friendly"],
      location: "Clement Town, Dehradun",
      availableFrom: "2024-01-15",
      price: 10000,
      profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=150&h=150&fit=crop&crop=face",
      lifestyle: "early_bird",
      cleanliness: "very_clean",
      compatibility: 92
    },
    {
      id: 2,
      name: "Rahul Verma",
      age: 26,
      gender: "Male",
      occupation: "Marketing Professional",
      description: "Looking for roommates to share an apartment. I am clean, sociable and respect privacy. I work in digital marketing and enjoy cooking and fitness.",
      preferences: ["Non-smoker", "Gym enthusiast", "Early riser"],
      location: "Rajpur Road, Dehradun",
      availableFrom: "2024-02-01",
      price: 12000,
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lifestyle: "early_bird",
      cleanliness: "clean",
      compatibility: 88
    },
    {
      id: 3,
      name: "Anjali Singh",
      age: 22,
      gender: "Female",
      occupation: "Student",
      description: "Friendly and organized student looking for a shared apartment. Enjoy cooking and movie nights with roommates.",
      preferences: ["Non-smoker", "Early riser", "Study focused"],
      location: "Dharampur, Dehradun",
      availableFrom: "2024-01-20",
      price: 9500,
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      lifestyle: "early_bird",
      cleanliness: "very_clean",
      compatibility: 95
    },
    {
      id: 4,
      name: "Amit Kumar",
      age: 28,
      gender: "Male",
      occupation: "Software Developer",
      description: "Quiet and focused professional. Looking for a peaceful environment. Enjoy coding and occasional gaming sessions.",
      preferences: ["Non-smoker", "Night owl", "Tech enthusiast"],
      location: "Sahastradhara, Dehradun",
      availableFrom: "2024-02-15",
      price: 11000,
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      lifestyle: "night_owl",
      cleanliness: "moderate",
      compatibility: 85
    },
    {
      id: 5,
      name: "Sneha Reddy",
      age: 25,
      gender: "Female",
      occupation: "Graphic Designer",
      description: "Creative and outgoing. Love exploring new cafes and art galleries. Looking for a roommate who enjoys a vibrant social life.",
      preferences: ["Pet friendly", "Vegetarian friendly", "Art lover"],
      location: "Mussoorie Road, Dehradun",
      availableFrom: "2024-01-25",
      price: 10500,
      profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      lifestyle: "social",
      cleanliness: "clean",
      compatibility: 78
    },
    {
      id: 6,
      name: "Vikram Gupta",
      age: 27,
      gender: "Male",
      occupation: "Data Analyst",
      description: "Analytical and organized. Prefer a clean and quiet living space. Enjoy fitness and weekend adventures.",
      preferences: ["Non-smoker", "Fitness enthusiast", "Organized"],
      location: "Prem Nagar, Dehradun",
      availableFrom: "2024-02-10",
      price: 13000,
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      lifestyle: "early_bird",
      cleanliness: "very_clean",
      compatibility: 90
    }
  ]

  // Real-time filtering
  useEffect(() => {
    const filtered = sampleRoommates.filter(roommate => {
      const matchesLocation = !filters.location || 
        roommate.location.toLowerCase().includes(filters.location.toLowerCase())
      
      const matchesGender = filters.gender === 'All' || roommate.gender === filters.gender
      
      const matchesAge = roommate.age >= filters.ageRange[0] && roommate.age <= filters.ageRange[1]
      
      const matchesBudget = roommate.price >= filters.budgetRange[0] && roommate.price <= filters.budgetRange[1]
      
      const matchesOccupation = !filters.occupation || 
        roommate.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
      
      const matchesLifestyle = !filters.lifestyle || roommate.lifestyle === filters.lifestyle
      
      const matchesCleanliness = !filters.cleanliness || roommate.cleanliness === filters.cleanliness
      
      return matchesLocation && matchesGender && matchesAge && matchesBudget && 
             matchesOccupation && matchesLifestyle && matchesCleanliness
    })
    
    setFilteredRoommates(filtered)
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }))
  }

  const handleGenderChange = (gender) => {
    setFilters(prevFilters => ({ ...prevFilters, gender }))
  }

  const handleAgeRangeChange = (newRange) => {
    setFilters(prevFilters => ({ ...prevFilters, ageRange: newRange }))
  }

  const handleBudgetRangeChange = (newRange) => {
    setFilters(prevFilters => ({ ...prevFilters, budgetRange: newRange }))
  }

  const handleResetFilters = () => {
    setFilters({
      location: '',
      gender: 'All',
      ageRange: [18, 40],
      budgetRange: [3000, 15000],
      occupation: '',
      lifestyle: '',
      cleanliness: ''
    })
  }

  // Range Slider Component
  const RangeSlider = ({ label, min, max, value, onChange, prefix = '', suffix = '' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{prefix}{value[0]}{suffix}</span>
        <span>{prefix}{value[1]}{suffix}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500 absolute top-0"
        />
      </div>
    </div>
  )

  const RoommateCard = ({ roommate }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative">
      {/* Compatibility Badge */}
      <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
        <Star className="h-4 w-4 mr-1" />
        {roommate.compatibility}% Match
      </div>
      
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={roommate.profilePic}
            alt={roommate.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{roommate.name}</h3>
            <p className="text-gray-600 text-sm">{roommate.age} years • {roommate.gender} • {roommate.occupation}</p>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{roommate.location}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{roommate.description}</p>
        
        {/* Preferences */}
        <div className="flex flex-wrap gap-2 mb-4">
          {roommate.preferences.map((pref, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {pref}
            </span>
          ))}
        </div>
        
        {/* Availability and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Available from {roommate.availableFrom}</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            ₹{roommate.price.toLocaleString()}/month
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Connect
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
            <UserCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Roommate</h1>
        <p className="text-gray-600">Connect with compatible roommates based on lifestyle, preferences, and budget</p>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="input"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-2">
                {['All', 'Male', 'Female'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(gender)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.gender === gender 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={filters.occupation}
                onChange={handleFilterChange}
                className="input"
                placeholder="Enter occupation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle</label>
              <select
                name="lifestyle"
                value={filters.lifestyle}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Lifestyles</option>
                <option value="early_bird">Early Bird</option>
                <option value="night_owl">Night Owl</option>
                <option value="social">Social</option>
                <option value="quiet">Quiet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cleanliness</label>
              <select
                name="cleanliness"
                value={filters.cleanliness}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Levels</option>
                <option value="very_clean">Very Clean</option>
                <option value="clean">Clean</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>
          </div>

          <RangeSlider
            label="Age Range"
            min={18}
            max={60}
            value={filters.ageRange}
            onChange={handleAgeRangeChange}
            suffix=" years"
          />

          <RangeSlider
            label="Budget Range"
            min={1000}
            max={30000}
            value={filters.budgetRange}
            onChange={handleBudgetRangeChange}
            prefix="₹"
          />

          <div className="flex justify-between items-center">
            <button 
              className="btn btn-outline"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
            <div className="text-sm text-gray-500">
              {filteredRoommates.length} roommates found
            </div>
          </div>
        </div>
      )}

      {/* Featured Roommates Slider */}
      <Slider
        title="Featured Roommates"
        subtitle="Top-rated compatible roommates in your area"
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        autoSlide={true}
        autoSlideInterval={5000}
        className="mb-8"
      >
        {sampleRoommates.slice(0, 3).map((roommate) => (
          <RoommateCard key={roommate.id} roommate={roommate} />
        ))}
      </Slider>

      {/* Filtered Roommates Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredRoommates.length > 0 ? `${filteredRoommates.length} Compatible Roommates Found` : 'No Roommates Found'}
          </h2>
          {filteredRoommates.length > 0 && (
            <span className="text-sm text-gray-500">
              Sorted by compatibility score
            </span>
          )}
        </div>
        {filteredRoommates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoommates.map((roommate) => (
              <RoommateCard key={roommate.id} roommate={roommate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No roommates found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={handleResetFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoommateFinder
