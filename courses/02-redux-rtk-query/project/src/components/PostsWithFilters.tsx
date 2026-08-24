import { useMemo } from 'react'

import {
  useGetPostsQuery,
} from '../api/apiSlice'

import {
  setFilterUserId,
  setSortBy,
} from '../store/slices/filtersSlice'

import {
  useAppDispatch,
  useAppSelector,
} from '../store/hooks'

export default function PostsWithFilters() {
  const dispatch = useAppDispatch()

  const {
    sortBy,
    filterUserId,
  } = useAppSelector(state => state.filters)

  const {
    data: posts = [],
    isLoading,
    error,
  } = useGetPostsQuery()

  const filteredPosts = useMemo(() => {
    let result = [...posts]

    if (filterUserId !== null) {
      result = result.filter(
        post => post.userId === filterUserId
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id
      }

      return a.id - b.id
    })

    return result
  }, [posts, filterUserId, sortBy])

  const userIds = Array.from(
    new Set(posts.map(post => post.userId))
  )

  if (isLoading) {
    return (
      <div
        data-testid="posts-with-filters"
        style={{ padding: '1rem' }}
      >
        <div data-testid="filter-controls">
          Loading filters...
        </div>

        <p>Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="posts-with-filters"
        style={{ padding: '1rem' }}
      >
        <div data-testid="filter-controls">
          <label>
            Sort:{' '}
            <select
              value={sortBy}
              onChange={event =>
                dispatch(
                  setSortBy(
                    event.target.value as 'newest' | 'oldest'
                  )
                )
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>

        <p>Failed to load posts.</p>
      </div>
    )
  }

  return (
    <div
      data-testid="posts-with-filters"
      style={{ padding: '1rem' }}
    >
      <div
        data-testid="filter-controls"
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <label>
          Sort:{' '}
          <select
            value={sortBy}
            onChange={event =>
              dispatch(
                setSortBy(
                  event.target.value as 'newest' | 'oldest'
                )
              )
            }
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>

        <label>
          User:{' '}
          <select
            value={
              filterUserId === null
                ? 'all'
                : String(filterUserId)
            }
            onChange={event => {
              const value = event.target.value

              dispatch(
                setFilterUserId(
                  value === 'all'
                    ? null
                    : Number(value)
                )
              )
            }}
          >
            <option value="all">All Users</option>

            {userIds.map(userId => (
              <option
                key={userId}
                value={userId}
              >
                User {userId}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        data-testid="posts-with-filters"
      >
        {filteredPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul>
            {filteredPosts.map(post => (
              <li key={post.id}>
                <strong>{post.title}</strong>

                <div>{post.body}</div>

                <small>
                  User {post.userId}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}