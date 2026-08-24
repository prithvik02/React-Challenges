import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { toggleSidebar } = uiSlice.actions

export default uiSlice.reducer