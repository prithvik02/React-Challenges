"use client";

import { createPost } from "../actions";

export default function PostForm() {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
        />
      </div>

      <div>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          name="body"
          required
        />
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
}