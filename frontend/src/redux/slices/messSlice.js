import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Async thunks
export const getMessListings = createAsyncThunk(
  'mess/getMessListings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/students/mess-listings', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mess listings')
    }
  }
)

export const getMessListingById = createAsyncThunk(
  'mess/getMessListingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/students/mess-listings/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mess listing')
    }
  }
)

// Initial state
const initialState = {
  messListings: [],
  currentMessListing: null,
  pagination: null,
  loading: false,
  error: null,
}

// Mess slice
const messSlice = createSlice({
  name: 'mess',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentMessListing: (state) => {
      state.currentMessListing = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Mess Listings
      .addCase(getMessListings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMessListings.fulfilled, (state, action) => {
        state.loading = false
        state.messListings = action.payload.messListings
        state.pagination = action.payload.pagination
      })
      .addCase(getMessListings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Get Mess Listing by ID
      .addCase(getMessListingById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMessListingById.fulfilled, (state, action) => {
        state.loading = false
        state.currentMessListing = action.payload
      })
      .addCase(getMessListingById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentMessListing } = messSlice.actions
export default messSlice.reducer
