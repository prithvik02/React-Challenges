import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data, isLoading, error } = useGetPostsQuery()

  if (isLoading) {
    return (
      <div id="posts-list" data-testid="posts-loading">
        Loading posts...
      </div>
    )
  }

  if (error) {
    return (
      <div id="posts-list" data-testid="posts-error">
        Failed to load posts
      </div>
    )
  }

  return (
    <div id="posts-list" data-testid="posts-list">
      <h3>Posts</h3>

      {data && data.length > 0 ? (
        <ul>
          {data.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  )
}