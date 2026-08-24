import { createSlice } from '@reduxjs/toolkit'

const middlewareNote =
  'middleware is configured by configureStore'

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

void middlewareNote

export const { toggleSidebar } = uiSlice.actions

export const uiReducer = uiSlice.reducer

export default uiSlice.reducer