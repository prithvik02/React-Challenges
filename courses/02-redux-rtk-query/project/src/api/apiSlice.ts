import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { mockApi } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',

  tagTypes: ['User', 'Post'],

  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),

  endpoints: builder => ({
    // Challenge 7 + Challenge 8
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

      providesTags: result =>
        result
          ? [
              ...result.map(user => ({
                type: 'User' as const,
                id: user.id,
              })),
              {
                type: 'User' as const,
                id: 'LIST',
              },
            ]
          : [
              {
                type: 'User' as const,
                id: 'LIST',
              },
            ],
    }),

    // Challenge 8
    getPosts: builder.query({
      queryFn: async () => {
        try {
          const data = await mockApi.getPosts()

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
                  : 'Failed to fetch posts',
            },
          }
        }
      },

      providesTags: result =>
        result
          ? [
              ...result.map(post => ({
                type: 'Post' as const,
                id: post.id,
              })),
              {
                type: 'Post' as const,
                id: 'LIST',
              },
            ]
          : [
              {
                type: 'Post' as const,
                id: 'LIST',
              },
            ],
    }),

    // Mutation for Challenge 8 and later challenges
    addPost: builder.mutation({
      queryFn: async post => {
        try {
          const data = await mockApi.createPost(post)

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
                  : 'Failed to create post',
            },
          }
        }
      },

      invalidatesTags: [
        {
          type: 'Post',
          id: 'LIST',
        },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useAddPostMutation,
} = apiSlice