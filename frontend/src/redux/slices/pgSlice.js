import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Async thunks
export const getPgListings = createAsyncThunk(
  'pg/getPgListings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/students/pg-listings', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch PG listings')
    }
  }
)

export const getPgListingById = createAsyncThunk(
  'pg/getPgListingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/students/pg-listings/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch PG listing')
    }
  }
)

export const addBookmark = createAsyncThunk(
  'pg/addBookmark',
  async (bookmarkData, { rejectWithValue }) => {
    try {
      const response = await api.post('/students/bookmarks', bookmarkData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add bookmark')
    }
  }
)

export const getBookmarks = createAsyncThunk(
  'pg/getBookmarks',
  async (type, { rejectWithValue }) => {
    try {
      const response = await api.get('/students/bookmarks', { params: { type } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks')
    }
  }
)

// Initial state
const initialState = {
  pgListings: [],
  currentPgListing: null,
  bookmarks: [],
  pagination: null,
  loading: false,
  error: null,
}

// PG slice
const pgSlice = createSlice({
  name: 'pg',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPgListing: (state) => {
      state.currentPgListing = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get PG Listings
      .addCase(getPgListings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPgListings.fulfilled, (state, action) => {
        state.loading = false
        state.pgListings = action.payload.pgListings
        state.pagination = action.payload.pagination
      })
      .addCase(getPgListings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Get PG Listing by ID
      .addCase(getPgListingById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPgListingById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPgListing = action.payload
      })
      .addCase(getPgListingById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add Bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload.bookmark)
      })
      
      // Get Bookmarks
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload
      })
  },
})

export const { clearError, clearCurrentPgListing } = pgSlice.actions
export default pgSlice.reducer
