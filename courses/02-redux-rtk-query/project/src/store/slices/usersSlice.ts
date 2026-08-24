import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { mockApi } from '../../api/mockServer'

const middlewareNote = 'middleware is configured by configureStore'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    return await mockApi.getUsers()
  }
)

const initialState = {
  list: [],
  loading: false,
  error: null as string | null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

void middlewareNote

export const usersReducer = usersSlice.reducer

export default usersSlice.reducer