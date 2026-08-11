import TaskCard from "./TaskCard"

type Task = {
  id: string | number
  title: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
}

type TaskListProps = {
  tasks: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
}: TaskListProps) {
  return (
    <div id="task-list">
      {countText && (
        <div id="task-count">
          {countText}
        </div>
      )}

      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <h2>{task.title}</h2>

          <TaskCard
            id={task.id}
            title={task.title}
            completed={task.completed}
            priority={task.priority}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}