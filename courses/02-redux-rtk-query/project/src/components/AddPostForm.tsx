import { FormEvent, useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState('1')

  const [addPost, { isLoading, isSuccess, error }] =
    useAddPostMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !body.trim()) {
      return
    }

    try {
      await addPost({
        userId: Number(userId),
        title: title.trim(),
        body: body.trim(),
      }).unwrap()

      setTitle('')
      setBody('')
    } catch {
      // Error is displayed through the mutation state.
    }
  }

  return (
    <form
      data-testid="add-post-form"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '500px',
      }}
    >
      <h2>Add Post</h2>

      <label>
        User ID
        <input
          type="number"
          value={userId}
          onChange={event => setUserId(event.target.value)}
          min="1"
        />
      </label>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Post title"
        />
      </label>

      <label>
        Body
        <textarea
          value={body}
          onChange={event => setBody(event.target.value)}
          placeholder="Post content"
          rows={5}
        />
      </label>

      <button
        type="submit"
        data-testid="add-post-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>

      {isSuccess && (
        <p data-testid="add-post-success">
          Post added successfully!
        </p>
      )}

      {error && (
        <p data-testid="add-post-error">
          Failed to add post.
        </p>
      )}
    </form>
  )
}