import { createSlice } from '@reduxjs/toolkit'

// middleware is configured by the store
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { toggleSidebar } = uiSlice.actions

export default uiSlice.reducer