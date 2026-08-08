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
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskList({
  tasks = [],
  countText,
}: TaskListProps) {
  const count = countText || `${tasks.length} Tasks`

  return (
    <section id="task-list">
      <div id="task-count">{count}</div>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
        />
      ))}
    </section>
  )
}