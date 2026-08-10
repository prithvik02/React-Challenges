import TaskCard from "./TaskCard"

type Task = {
  id: string | number
  title: string
  completed: boolean
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
  onDelete
}: TaskListProps) {
  return (
    <div id="task-list">
      <div id="task-count">{countText}</div>

      {tasks.map(task => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}