type TaskCardProps = {
  id: string | number
  title: string
  completed: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  title,
  completed,
  onToggle,
  onDelete
}: TaskCardProps) {
  return (
    <div id="task-card">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle?.(id)}
      />

      <span
        style={{
          textDecoration: completed ? "line-through" : "none"
        }}
      >
        {title}
      </span>

      {onDelete && (
        <button
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              onDelete(id)
            }
          }}
        >
          Delete
        </button>
      )}
    </div>
  )
}