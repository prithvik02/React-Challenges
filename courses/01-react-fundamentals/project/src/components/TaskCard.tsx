type TaskCardProps = {
  id: string | number
  title: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  title,
  completed,
  priority,
  onToggle,
  onDelete,
}: TaskCardProps) {
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
            ? "line-through"
            : "none",
        }}
      >
        {title}
      </span>

      {priority && (
        <span>{priority}</span>
      )}

      {onDelete && (
        <button onClick={() => onDelete(id)}>
          Delete
        </button>
      )}
    </div>
  )
}