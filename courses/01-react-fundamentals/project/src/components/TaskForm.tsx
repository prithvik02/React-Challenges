import { useState } from 'react'
import type { Task } from './TaskList'

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    }

    onAddTask(newTask)

    setTitle('')
    setDescription('')
    setPriority('Medium')
    setError('')
  }

  return (
    <form id="task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit">Add Task</button>
    </form>
  )
}