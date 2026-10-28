import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Home, MapPin, Users, Star, Search, Filter, Wifi, Car, Utensils, Droplets, Zap, Shield } from 'lucide-react'
import Slider from '../components/Slider'
import { getPgListings } from '../redux/slices/pgSlice'

const PgListings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pgListings, loading } = useSelector((state) => state.pg)
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [3000, 15000],
    roomType: '',
    facilities: []
  })
  const [filteredPgs, setFilteredPgs] = useState([])

  useEffect(() => {
    dispatch(getPgListings())
  }, [dispatch])

  // Real-time filtering
  useEffect(() => {
    const filtered = samplePgs.filter(pg => {
      const matchesLocation = !filters.location || 
        pg.location.toLowerCase().includes(filters.location.toLowerCase())
      
      const matchesPrice = pg.price >= filters.priceRange[0] && 
        pg.price <= filters.priceRange[1]
      
      const matchesRoomType = !filters.roomType || 
        pg.roomType.toLowerCase().includes(filters.roomType.toLowerCase())
      
      const matchesFacilities = filters.facilities.length === 0 || 
        filters.facilities.every(facility => pg.facilities.includes(facility))
      
      return matchesLocation && matchesPrice && matchesRoomType && matchesFacilities
    })
    
    setFilteredPgs(filtered)
  }, [filters])

  const handleSearch = () => {
    // Apply filters and search
    dispatch(getPgListings(filters))
  }

  const handlePriceRangeChange = (newRange) => {
    setFilters({...filters, priceRange: newRange})
  }

  const handleFacilityToggle = (facility) => {
    setFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleViewDetails = (pgId) => {
    navigate(`/pg-details/${pgId}`)
  }

  const samplePgs = [
    {
      id: 1,
      title: "Modern PG Clement Town",
      location: "Clement Town, Dehradun",
      roomType: "Double Room",
      price: 5500,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food", "Security"]
    },
    {
      id: 2,
      title: "Comfort Zone PG",
      location: "Rajpur Road, Dehradun",
      roomType: "Single Room",
      price: 7500,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food"]
    },
    {
      id: 3,
      title: "Student Hub PG",
      location: "Dharampur, Dehradun",
      roomType: "Triple Room",
      price: 4000,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      facilities: ["WiFi", "RO Water", "Food", "Security"]
    },
    {
      id: 4,
      title: "Elite PG Services",
      location: "Sahastradhara, Dehradun",
      roomType: "Double Room",
      price: 6500,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food", "Security"]
    },
    {
      id: 5,
      title: "Green Valley PG",
      location: "Mussoorie Road, Dehradun",
      roomType: "Single Room",
      price: 8000,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      facilities: ["WiFi", "AC", "RO Water", "Parking", "Food", "Security"]
    },
    {
      id: 6,
      title: "Budget Friendly PG",
      location: "Prem Nagar, Dehradun",
      roomType: "Triple Room",
      price: 3500,
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      facilities: ["WiFi", "RO Water", "Food"]
    }
  ]

  const facilityOptions = [
    { id: 'WiFi', name: 'WiFi', icon: Wifi },
    { id: 'AC', name: 'AC', icon: Zap },
    { id: 'RO Water', name: 'RO Water', icon: Droplets },
    { id: 'Parking', name: 'Parking', icon: Car },
    { id: 'Food', name: 'Food', icon: Utensils },
    { id: 'Security', name: 'Security', icon: Shield }
  ]

  const PgCard = ({ pg }) => (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1.5 border border-secondary-100 overflow-hidden">
      <div className="relative">
        <img 
          src={pg.image} 
          alt={pg.title}
          className="w-full h-52 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 flex items-center shadow-soft">
          <Star className="h-4 w-4 text-yellow-500 mr-1.5" fill="currentColor" />
          <span className="text-sm font-semibold">{pg.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-secondary-900 mb-2 line-clamp-1">{pg.title}</h3>
        <div className="flex items-center text-secondary-600 mb-2">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-primary-500" />
          <span className="text-sm truncate">{pg.location}</span>
        </div>
        <div className="flex items-center text-secondary-600 mb-4">
          <Users className="h-4 w-4 mr-1.5 flex-shrink-0 text-primary-500" />
          <span className="text-sm">{pg.roomType}</span>
        </div>
        
        {/* Facilities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pg.facilities.slice(0, 3).map((facility, index) => (
            <span key={index} className="badge badge-primary">
              {facility}
            </span>
          ))}
          {pg.facilities.length > 3 && (
            <span className="badge badge-secondary">
              +{pg.facilities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-accent-600">₹{pg.price.toLocaleString()}<span className="text-sm font-normal text-secondary-500">/mo</span></span>
          <button 
            onClick={() => handleViewDetails(pg.id)}
            className="btn btn-primary py-2 px-4"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PG Listings</h1>
        <p className="text-gray-600">Find your perfect PG accommodation</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select 
              className="input"
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">₹{filters.priceRange[0].toLocaleString()}</span>
              <input
                type="range"
                min="1000"
                max="20000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), filters.priceRange[1]])}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <input
                type="range"
                min="1000"
                max="20000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value)])}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <span className="text-sm text-gray-600">₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Facilities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {facilityOptions.map((facility) => (
              <label key={facility.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.facilities.includes(facility.id)}
                  onChange={() => handleFacilityToggle(facility.id)}
                  className="sr-only"
                />
                <div className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                  filters.facilities.includes(facility.id)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}>
                  <facility.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{facility.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            className="btn btn-outline"
            onClick={() => setFilters({ location: '', priceRange: [3000, 15000], roomType: '', facilities: [] })}
          >
            Reset Filters
          </button>
          <button 
            className="btn btn-primary flex items-center"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search PGs
          </button>
        </div>
      </div>

      {/* Featured PGs Slider */}
      <Slider
        title="Featured PG Listings"
        subtitle="Top-rated PG accommodations in your area"
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        autoSlide={true}
        autoSlideInterval={4000}
        className="mb-8"
      >
        {samplePgs.map((pg) => (
          <PgCard key={pg.id} pg={pg} />
        ))}
      </Slider>

      {/* Filtered PGs Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredPgs.length > 0 ? `${filteredPgs.length} PG Listings Found` : 'No PGs Found'}
          </h2>
          {filteredPgs.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing results for your filters
            </span>
          )}
        </div>
        {filteredPgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPgs.map((pg) => (
              <PgCard key={pg.id} pg={pg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No PGs found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setFilters({ location: '', priceRange: [3000, 15000], roomType: '', facilities: [] })}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PgListings