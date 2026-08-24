import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()

  const id = postId ? Number(postId) : 1

  const {
    data: post,
    isLoading,
    error,
  } = useGetPostByIdQuery(id, {
    skip: !Number.isFinite(id),
  })

  if (isLoading) {
    return (
      <div
        data-testid="post-detail-loading"
        style={{ padding: '1rem' }}
      >
        Loading post...
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="post-detail-error"
        style={{ padding: '1rem' }}
      >
        Failed to load post.
      </div>
    )
  }

  if (!post) {
    return (
      <div
        data-testid="post-detail-error"
        style={{ padding: '1rem' }}
      >
        Post not found.
      </div>
    )
  }

  return (
    <div
      data-testid="post-detail"
      style={{ padding: '1rem' }}
    >
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p>User ID: {post.userId}</p>
    </div>
  )
}