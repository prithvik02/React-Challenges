import { useState } from 'react'
import type { Task } from './TaskList'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'
import FormInput from './FormInput'

type TaskCardProps = {
  id?: string | number
  task?: Task
  title?: string
  description?: string
  priority?: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string
  onToggle?: (id?: string | number) => void
  onDelete?: (id?: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category: string
      tags: string[]
      dueDate?: string
    }
  ) => void
  editingId?: string | number | null
}

export default function TaskCard({
  id: idProp,
  task,
  title: titleProp,
  description: descriptionProp,
  priority: priorityProp,
  completed: completedProp = false,
  category: categoryProp = 'General',
  tags: tagsProp = [],
  dueDate: dueDateProp,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
}: TaskCardProps) {
  const id = task?.id ?? idProp
  const title = task?.title ?? titleProp ?? ''
  const description = task?.description ?? descriptionProp ?? ''
  const priority = task?.priority ?? priorityProp ?? 'Medium'
  const completed = task?.completed ?? completedProp
  const category = task?.category ?? categoryProp ?? 'General'
  const tags = task?.tags ?? tagsProp ?? []
  const dueDate = task?.dueDate ?? dueDateProp

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] =
    useState(description)
  const [editPriority, setEditPriority] =
    useState(priority)
  const [editCategory, setEditCategory] =
    useState(category)
  const [editTags, setEditTags] =
    useState(tags.join(', '))
  const [editDueDate, setEditDueDate] =
    useState(dueDate ?? '')

  const isEditing =
    editingId !== undefined
      ? editingId === id
      : editing

  const getDueStatus = () => {
    if (completed || !dueDate) {
      return null
    }

    const date = new Date(dueDate)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    const today = new Date()

    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    const difference =
      (date.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)

    if (difference < 0) {
      return 'overdue' as const
    }

    if (difference === 0) {
      return 'due-today' as const
    }

    if (difference <= 3) {
      return 'due-soon' as const
    }

    return null
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(id)
    }
  }

  const handleSave = () => {
    if (!editTitle.trim()) {
      return
    }

    if (onUpdateTask && id !== undefined) {
      onUpdateTask(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        category: editCategory.trim() || 'General',
        tags: editTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        dueDate: editDueDate || undefined,
      })
    }

    setEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(dueDate ?? '')
    setEditing(false)
  }

  if (isEditing) {
    return (
      <div className="task-card">
        <FormInput
          label="Title"
          id={`edit-title-${id ?? 'task'}`}
          value={editTitle}
          onChange={event =>
            setEditTitle(event.target.value)
          }
        />

        <FormInput
          label="Description"
          id={`edit-description-${id ?? 'task'}`}
          value={editDescription}
          onChange={event =>
            setEditDescription(event.target.value)
          }
        />

        <label htmlFor={`edit-priority-${id ?? 'task'}`}>
          Priority
        </label>

        <select
          id={`edit-priority-${id ?? 'task'}`}
          value={editPriority}
          onChange={event =>
            setEditPriority(event.target.value)
          }
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label htmlFor={`edit-category-${id ?? 'task'}`}>
          Category
        </label>

        <select
          id={`edit-category-${id ?? 'task'}`}
          value={editCategory}
          onChange={event =>
            setEditCategory(event.target.value)
          }
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="College">College</option>
        </select>

        <FormInput
          label="Tags"
          id={`edit-tags-${id ?? 'task'}`}
          value={editTags}
          onChange={event =>
            setEditTags(event.target.value)
          }
          placeholder="tag1, tag2"
        />

        <FormInput
          label="Due Date"
          id={`edit-due-date-${id ?? 'task'}`}
          type="date"
          value={editDueDate}
          onChange={event =>
            setEditDueDate(event.target.value)
          }
        />

        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
        >
          Save
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    )
  }

  const dueStatus = getDueStatus()

  return (
    <div className="task-card">
      <h2
        style={{
          textDecoration: completed
            ? 'line-through'
            : 'none',
        }}
      >
        {title}
      </h2>

      <article
        id="task-card"
        data-completed={completed ? 'true' : 'false'}
      >
        {onToggle && (
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
          />
        )}

        <Badge type="priority">
          Priority: {priority}
        </Badge>
      </article>

      <div id="task-category">
        <Badge type="category">
          {category}
        </Badge>
      </div>

      <div id="task-tags">
        {tags.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            type="tag"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <p>{description}</p>

      {dueDate && (
        <div id="task-due-date">
          {new Date(dueDate).toLocaleDateString()}
        </div>
      )}

      {completed && (
        <StatusIndicator status="completed" />
      )}

      {!completed && dueStatus && (
        <StatusIndicator status={dueStatus} />
      )}

      {onUpdateTask && id !== undefined && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditing(true)}
        >
          Edit
        </Button>
      )}

      {onDelete && id !== undefined && (
        <Button
          type="button"
          variant="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </div>
  )
}