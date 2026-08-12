import React, { useRef, useState } from 'react'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'

type TaskCardProps = {
  id?: string | number
  title: string
  description: string
  priority: string
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
  onEdit?: (id: string | number) => void
}

function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onEdit,
}: TaskCardProps) {
  const renderCount = useRef(0)
  renderCount.current += 1

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
    useState(dueDate || '')

  const isEditing =
    id !== undefined &&
    editingId === id

  const handleEdit = () => {
    if (id === undefined) {
      return
    }

    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(dueDate || '')

    if (onEdit) {
      onEdit(id)
    }
  }

  const handleSave = () => {
    if (
      id === undefined ||
      !onUpdateTask ||
      !editTitle.trim()
    ) {
      return
    }

    const parsedTags = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    onUpdateTask(id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      category: editCategory || 'General',
      tags: parsedTags,
      dueDate: editDueDate || undefined,
    })
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(dueDate || '')

    if (id !== undefined && onEdit) {
      onEdit(id)
    }
  }

  const handleDelete = () => {
    if (
      id === undefined ||
      !onDelete
    ) {
      return
    }

    if (window.confirm('Are you sure?')) {
      onDelete(id)
    }
  }

  return (
    <div
      className="task-card"
      data-render-count={renderCount.current}
    >
      {isEditing ? (
        <div>
          <input
            id="edit-task-title"
            type="text"
            value={editTitle}
            onChange={event =>
              setEditTitle(event.target.value)
            }
          />

          <textarea
            id="edit-task-description"
            value={editDescription}
            onChange={event =>
              setEditDescription(
                event.target.value
              )
            }
          />

          <select
            id="edit-task-priority"
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
            id="edit-task-category"
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
            id="edit-task-tags"
            type="text"
            value={editTags}
            onChange={event =>
              setEditTags(event.target.value)
            }
          />

          <input
            id="edit-task-due-date"
            type="date"
            value={editDueDate}
            onChange={event =>
              setEditDueDate(event.target.value)
            }
          />

          <button
            type="button"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div id="task-card">
            <span
              style={{
                textDecoration: completed
                  ? 'line-through'
                  : 'none',
              }}
            >
              {title}
            </span>

            <Badge variant="priority">
              Priority: {priority}
            </Badge>
          </div>

          <div id="task-category">
            <Badge variant="category">
              {category}
            </Badge>
          </div>

          <div id="task-tags">
            {tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="tag"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {dueDate && (
            <div id="task-due-date">
              {new Date(
                dueDate
              ).toLocaleDateString()}
            </div>
          )}

          {completed && (
            <StatusIndicator
              status="completed"
            />
          )}

          <p>{description}</p>

          {onToggle &&
            id !== undefined && (
              <input
                type="checkbox"
                checked={completed}
                onChange={() =>
                  onToggle(id)
                }
              />
            )}

          {onEdit &&
            id !== undefined && (
              <button
                type="button"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}

          {onUpdateTask &&
            id !== undefined &&
            !onEdit && (
              <button
                type="button"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}

          {onDelete &&
            id !== undefined && (
              <button
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
        </>
      )}
    </div>
  )
}

export default React.memo(TaskCard)