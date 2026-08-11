import { useEffect, useState } from 'react'
import type { Task } from './TaskList'

type TaskCardProps = {
  task?: Task
  id?: string | number
  title?: string
  description?: string
  priority?: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category?: string
      tags?: string[]
      dueDate?: string
    }
  ) => void
  editingId?: string | number | null
}

export default function TaskCard({
  task,
  id,
  title,
  description,
  priority,
  completed,
  category,
  tags,
  dueDate,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
}: TaskCardProps) {
  const taskId = task?.id ?? id ?? 0
  const taskTitle = task?.title ?? title ?? ''
  const taskDescription =
    task?.description ?? description ?? ''
  const taskPriority =
    task?.priority ?? priority ?? 'Medium'
  const taskCompleted =
    task?.completed ?? completed ?? false
  const taskCategory =
    task?.category ?? category ?? 'General'
  const taskTags =
    task?.tags ?? tags ?? []
  const taskDueDate =
    task?.dueDate ?? dueDate ?? ''

  const [editing, setEditing] = useState(false)

  const [editTitle, setEditTitle] =
    useState(taskTitle)

  const [editDescription, setEditDescription] =
    useState(taskDescription)

  const [editPriority, setEditPriority] =
    useState(taskPriority)

  const [editCategory, setEditCategory] =
    useState(taskCategory)

  const [editTags, setEditTags] =
    useState(taskTags.join(', '))

  const [editDueDate, setEditDueDate] =
    useState(taskDueDate)

  useEffect(() => {
    if (
      editingId !== undefined &&
      editingId !== null &&
      editingId !== taskId
    ) {
      setEditing(false)
    }
  }, [editingId, taskId])

  useEffect(() => {
    setEditTitle(taskTitle)
    setEditDescription(taskDescription)
    setEditPriority(taskPriority)
    setEditCategory(taskCategory)
    setEditTags(taskTags.join(', '))
    setEditDueDate(taskDueDate)
  }, [
    taskTitle,
    taskDescription,
    taskPriority,
    taskCategory,
    taskTags,
    taskDueDate,
  ])

  const startEdit = () => {
    setEditTitle(taskTitle)
    setEditDescription(taskDescription)
    setEditPriority(taskPriority)
    setEditCategory(taskCategory)
    setEditTags(taskTags.join(', '))
    setEditDueDate(taskDueDate)
    setEditing(true)
  }

  const saveEdit = () => {
    const cleanTitle = editTitle.trim()

    if (!cleanTitle) {
      return
    }

    const cleanTags = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (onUpdateTask) {
      onUpdateTask(taskId, {
        title: cleanTitle,
        description: editDescription.trim(),
        priority: editPriority,
        category: editCategory.trim() || 'General',
        tags: cleanTags,
        dueDate: editDueDate || undefined,
      })
    }

    setEditing(false)
  }

  const cancelEdit = () => {
    setEditTitle(taskTitle)
    setEditDescription(taskDescription)
    setEditPriority(taskPriority)
    setEditCategory(taskCategory)
    setEditTags(taskTags.join(', '))
    setEditDueDate(taskDueDate)
    setEditing(false)
  }

  const getDueDateStatus = () => {
    if (!taskDueDate) {
      return ''
    }

    const due = new Date(taskDueDate)

    if (Number.isNaN(due.getTime())) {
      return ''
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDay = new Date(due)
    dueDay.setHours(0, 0, 0, 0)

    const difference =
      dueDay.getTime() - today.getTime()

    const days =
      Math.round(
        difference / (1000 * 60 * 60 * 24)
      )

    if (!taskCompleted && days < 0) {
      return 'Overdue'
    }

    if (days === 0) {
      return 'Due Today'
    }

    if (days > 0 && days <= 3) {
      return 'Due Soon'
    }

    return ''
  }

  const dueStatus = getDueDateStatus()

  const readableDueDate = taskDueDate
    ? new Date(taskDueDate).toLocaleDateString()
    : ''

  if (editing) {
    return (
      <div className="task-card">
        <input
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={event =>
            setEditTitle(event.target.value)
          }
        />

        <textarea
          id="edit-description"
          value={editDescription}
          onChange={event =>
            setEditDescription(event.target.value)
          }
        />

        <select
          id="edit-priority"
          value={editPriority}
          onChange={event =>
            setEditPriority(event.target.value)
          }
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          id="edit-category"
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

        <input
          id="edit-tags"
          type="text"
          value={editTags}
          onChange={event =>
            setEditTags(event.target.value)
          }
          placeholder="Tags separated by commas"
        />

        <input
          id="edit-due-date"
          type="date"
          value={editDueDate}
          onChange={event =>
            setEditDueDate(event.target.value)
          }
        />

        <button
          type="button"
          onClick={saveEdit}
        >
          Save
        </button>

        <button
          type="button"
          onClick={cancelEdit}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="task-card">
      <h2>{taskTitle}</h2>

      <div id="task-card">
        {onToggle && (
          <input
            type="checkbox"
            checked={taskCompleted}
            onChange={() =>
              onToggle(taskId)
            }
          />
        )}

        <span
          style={{
            textDecoration: taskCompleted
              ? 'line-through'
              : 'none',
          }}
        >
          {taskCompleted ? 'Completed' : ''}
        </span>

        <span>
          Priority: {taskPriority}
        </span>
      </div>

      <div id="task-category">
        {taskCategory}
      </div>

      <div id="task-tags">
        {taskTags.map(tag => (
          <span
            key={tag}
            className="task-tag"
            data-tag={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      {taskDescription && (
        <p>{taskDescription}</p>
      )}

      {taskDueDate && (
        <div
          id="task-due-date"
          data-overdue={
            dueStatus === 'Overdue'
              ? 'true'
              : 'false'
          }
        >
          <span>
            Due: {readableDueDate}
          </span>

          {dueStatus && (
            <span>
              {dueStatus}
            </span>
          )}
        </div>
      )}

      {onUpdateTask && (
        <button
          type="button"
          onClick={startEdit}
        >
          Edit
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() =>
            onDelete(taskId)
          }
        >
          Delete
        </button>
      )}
    </div>
  )
}