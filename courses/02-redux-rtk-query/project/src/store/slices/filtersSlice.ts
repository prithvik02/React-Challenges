import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

export type SortBy = 'newest' | 'oldest'

export interface FiltersState {
  sortBy: SortBy
  filterUserId: number | null
}

const initialState: FiltersState = {
  sortBy: 'newest',
  filterUserId: null,
}

// Middleware is configured centrally by configureStore.
const middlewareNote =
  'middleware is configured by configureStore'

const filtersSlice = createSlice({
  name: 'filters',

  initialState,

  reducers: {
    setSortBy: (
      state,
      action: PayloadAction<SortBy>
    ) => {
      state.sortBy = action.payload
    },

    setFilterUserId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.filterUserId = action.payload
    },

    resetFilters: state => {
      state.sortBy = 'newest'
      state.filterUserId = null
    },
  },
})

void middlewareNote

export const {
  setSortBy,
  setFilterUserId,
  resetFilters,
} = filtersSlice.actions

export const filtersReducer = filtersSlice.reducer

export default filtersSlice.reducer