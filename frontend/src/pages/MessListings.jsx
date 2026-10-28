import React, { useState, useEffect } from 'react'
import { Utensils, MapPin, Star, Clock, Search, Filter } from 'lucide-react'
import Slider from '../components/Slider'

const MessListings = () => {
  const [filters, setFilters] = useState({
    location: '',
    foodType: '',
    maxPrice: ''
  })
  const [filteredMess, setFilteredMess] = useState([])

  // Real-time filtering
  useEffect(() => {
    const filtered = sampleMess.filter(mess => {
      const matchesLocation = !filters.location || 
        mess.location.toLowerCase().includes(filters.location.toLowerCase())
      
      const matchesFoodType = !filters.foodType || 
        mess.foodType.toLowerCase().includes(filters.foodType.toLowerCase())
      
      const matchesPrice = !filters.maxPrice || 
        mess.price <= parseInt(filters.maxPrice)
      
      return matchesLocation && matchesFoodType && matchesPrice
    })
    
    setFilteredMess(filtered)
  }, [filters])

  const handleSearch = () => {
    // Apply filters and search
    console.log("Searching with filters:", filters)
  }

  const sampleMess = [
    {
      id: 1,
      name: "Delicious Mess",
      location: "Clement Town, Dehradun",
      foodType: "Vegetarian",
      price: 2500,
      rating: 4.2,
      timings: "7AM-9PM",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Spice Garden Mess",
      location: "Rajpur Road, Dehradun",
      foodType: "Both",
      price: 3000,
      rating: 4.5,
      timings: "7AM-10PM",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Home Style Mess",
      location: "Dharampur, Dehradun",
      foodType: "Vegetarian",
      price: 2200,
      rating: 4.7,
      timings: "6AM-9PM",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Tasty Bites Mess",
      location: "Sahastradhara, Dehradun",
      foodType: "Non-Vegetarian",
      price: 3500,
      rating: 4.3,
      timings: "8AM-9PM",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Healthy Choice Mess",
      location: "Mussoorie Road, Dehradun",
      foodType: "Vegetarian",
      price: 2800,
      rating: 4.6,
      timings: "7AM-8PM",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Budget Mess",
      location: "Prem Nagar, Dehradun",
      foodType: "Both",
      price: 2000,
      rating: 4.1,
      timings: "6AM-9PM",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop"
    }
  ]

  const MessCard = ({ mess }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        <img 
          src={mess.image} 
          alt={mess.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{mess.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{mess.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{mess.location}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Utensils className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{mess.foodType}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{mess.timings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">₹{mess.price.toLocaleString()}</span>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mess Listings</h1>
        <p className="text-gray-600">Find the perfect mess for your meals</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select 
              className="input"
              value={filters.foodType}
              onChange={(e) => setFilters({...filters, foodType: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input 
              type="number" 
              className="input" 
              placeholder="3000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
          </div>
        </div>
        <div className="mt-4">
          <button 
            className="btn btn-primary flex items-center"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Mess
          </button>
        </div>
      </div>

      {/* Featured Mess Slider */}
      <Slider
        title="Featured Mess Services"
        subtitle="Top-rated mess services in your area"
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        autoSlide={true}
        autoSlideInterval={4500}
        className="mb-8"
      >
        {sampleMess.map((mess) => (
          <MessCard key={mess.id} mess={mess} />
        ))}
      </Slider>

      {/* Filtered Mess Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredMess.length > 0 ? `${filteredMess.length} Mess Listings Found` : 'No Mess Found'}
          </h2>
          {filteredMess.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing results for your filters
            </span>
          )}
        </div>
        {filteredMess.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMess.map((mess) => (
              <MessCard key={mess.id} mess={mess} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Mess found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setFilters({ location: '', foodType: '', maxPrice: '' })}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessListings