import { useState } from 'react'
import Button from './Button'
import FormInput from './FormInput'

type TaskFormProps = {
  onAddTask: (task: {
    id: string | number
    title: string
    description: string
    priority: string
    completed: boolean
    category: string
    tags: string[]
    dueDate?: string
  }) => void
  onCancel?: () => void
  initialTask?: {
    id?: string | number
    title?: string
    description?: string
    priority?: string
    completed?: boolean
    category?: string
    tags?: string[]
    dueDate?: string
  }
  isEditing?: boolean
}

function TaskForm({
  onAddTask,
  onCancel,
  initialTask,
  isEditing = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(
    initialTask?.description || ''
  )
  const [priority, setPriority] = useState(
    initialTask?.priority || 'Medium'
  )
  const [category, setCategory] = useState(
    initialTask?.category || 'General'
  )
  const [tags, setTags] = useState(
    initialTask?.tags?.join(', ') || ''
  )
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate || ''
  )
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanTitle = title.trim()

    if (!cleanTitle) {
      setError('Title is required')
      return
    }

    setError('')

    const task = {
      id: initialTask?.id ?? Date.now(),
      title: cleanTitle,
      description: description.trim(),
      priority,
      completed: initialTask?.completed ?? false,
      category: category || 'General',
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      dueDate: dueDate || undefined,
    }

    onAddTask(task)

    if (!isEditing) {
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setCategory('General')
      setTags('')
      setDueDate('')
    }
  }

  return (
    <form id="task-form" onSubmit={handleSubmit}>
      <FormInput
        label="Title"
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
      />

      {error && (
        <div id="task-form-error">
          {error}
        </div>
      )}

      <FormInput
        label="Description"
        id="task-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
      />

      <label htmlFor="task-priority">
        Priority
      </label>

      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <label htmlFor="task-category">
        Category
      </label>

      <select
        id="task-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="College">College</option>
      </select>

      <div className="form-input">
        <label htmlFor="task-tags-input">
          Tags
        </label>

        <input
          id="task-tags-input"
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="tag1, tag2"
        />
      </div>

      <div className="form-input">
        <label htmlFor="task-due-date">
          Due Date
        </label>

        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
      >
        {isEditing ? 'Save' : 'Add Task'}
      </Button>

      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

export default TaskForm