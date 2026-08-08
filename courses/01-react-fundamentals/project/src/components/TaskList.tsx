import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskList({
  tasks = [],
  countText,
  onToggle,
}: TaskListProps) {
  const completedCount = tasks.filter((task) => task.completed).length
  const count = countText || `${completedCount} of ${tasks.length} completed`

  return (
    <section id="task-list">
      <div id="task-count">{count}</div>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={onToggle ? () => onToggle(task.id) : undefined}
        />
      ))}
    </section>
  )
}