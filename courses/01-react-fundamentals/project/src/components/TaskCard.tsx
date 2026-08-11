type TaskCardProps = {
  id: string | number
  title: string
  description?: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
  isEditing?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onEdit?: (id: string | number) => void
  onSave?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
    }
  ) => void
  onCancel?: () => void
}

export default function TaskCard({
  id,
  title,
  description = '',
  completed,
  priority = 'medium',
  isEditing = false,
  onToggle,
  onDelete,
  onEdit,
  onSave,
  onCancel,
}: TaskCardProps) {
  if (isEditing) {
    return (
      <div id="task-card">
        <input
          type="text"
          value={title}
          readOnly
          hidden
        />

        <label>
          Title
          <input
            type="text"
            defaultValue={title}
            id={`edit-title-${id}`}
          />
        </label>

        <label>
          Description
          <textarea
            defaultValue={description}
            id={`edit-description-${id}`}
          />
        </label>

        <label>
          Priority
          <select
            defaultValue={priority}
            id={`edit-priority-${id}`}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <button
          onClick={() => {
            const titleInput = document.getElementById(
              `edit-title-${id}`
            ) as HTMLInputElement

            const descriptionInput = document.getElementById(
              `edit-description-${id}`
            ) as HTMLTextAreaElement

            const priorityInput = document.getElementById(
              `edit-priority-${id}`
            ) as HTMLSelectElement

            const newTitle = titleInput.value.trim()

            if (!newTitle) {
              return
            }

            onSave?.(id, {
              title: newTitle,
              description: descriptionInput.value,
              priority: priorityInput.value as
                | 'high'
                | 'medium'
                | 'low',
            })
          }}
        >
          Save
        </button>

        <button onClick={onCancel}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div id="task-card">
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      )}

      <span
        style={{
          textDecoration: completed
            ? 'line-through'
            : 'none',
        }}
      >
        {title}
      </span>

      {description && (
        <span>{description}</span>
      )}

      {priority && (
        <span>{priority}</span>
      )}

      {onEdit && (
        <button onClick={() => onEdit(id)}>
          Edit
        </button>
      )}

      {onDelete && (
        <button onClick={() => onDelete(id)}>
          Delete
        </button>
      )}
    </div>
  )
}