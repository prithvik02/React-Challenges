import { useState } from "react"
import TaskCard from "./TaskCard"

type Task = {
  id: string | number
  title: string
  description?: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
}

type TaskListProps = {
  tasks: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
    }
  ) => void
  editingId?: string | number | null
}

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId: externalEditingId,
}: TaskListProps) {
  const [localEditingId, setLocalEditingId] = useState<
    string | number | null
  >(null)

  const editingId =
    externalEditingId !== undefined
      ? externalEditingId
      : localEditingId

  const startEditing = (
    id: string | number
  ) => {
    setLocalEditingId(id)
  }

  const stopEditing = () => {
    setLocalEditingId(null)
  }

  return (
    <div id="task-list">
      {countText && (
        <div id="task-count">
          {countText}
        </div>
      )}

      {tasks.map(task => (
        <div
          key={task.id}
          className="task-card"
        >
          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            priority={task.priority}
            isEditing={editingId === task.id}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={startEditing}
            onCancel={stopEditing}
            onSave={(id, updates) => {
              if (!updates.title.trim()) {
                return
              }

              onUpdateTask?.(id, updates)
              stopEditing()
            }}
          />
        </div>
      ))}
    </div>
  )
}