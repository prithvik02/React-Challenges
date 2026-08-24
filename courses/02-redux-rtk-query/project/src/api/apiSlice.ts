import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { mockApi } from './mockServer'

export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export const apiSlice = createApi({
  reducerPath: 'api',

  tagTypes: ['User', 'Post'],

  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),

  endpoints: builder => ({
    // -------------------------
    // USERS - Challenge 7
    // -------------------------
    getUsers: builder.query<User[], void>({
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

    // -------------------------
    // POSTS - Challenge 8
    // -------------------------
    getPosts: builder.query<Post[], void>({
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

    // -------------------------
    // GET POST BY ID - Challenge 13
    // -------------------------
    getPostById: builder.query<Post, number>({
      queryFn: async id => {
        try {
          const data = await mockApi.getPostById(id)

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
                  : 'Failed to fetch post',
            },
          }
        }
      },

      providesTags: (_result, _error, id) => [
        {
          type: 'Post',
          id,
        },
      ],
    }),

    // -------------------------
    // ADD POST - Challenge 9
    // -------------------------
    addPost: builder.mutation<
      Post,
      Omit<Post, 'id'>
    >({
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

      // Optimistic update - Challenge 10
      async onQueryStarted(
        newPost,
        { dispatch, queryFulfilled }
      ) {
        const optimisticPost: Post = {
          ...newPost,
          id: Date.now(),
        }

        const patchResult =
          dispatch(
            apiSlice.util.updateQueryData(
              'getPosts',
              undefined,
              draft => {
                draft.push(optimisticPost)
              }
            )
          )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = apiSlice