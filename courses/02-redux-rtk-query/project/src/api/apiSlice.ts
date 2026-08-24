import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { mockApi } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),

  endpoints: builder => ({
    getUsers: builder.query({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()

          return {
            data,
          }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch users',
            },
          }
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
} = apiSlice