import TaskCard from './TaskCard'

export type Task = {
  id: string | number
  title: string
  description?: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
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
      priority: string
      category?: string
      tags?: string[]
    }
  ) => void
  editingId?: string | number | null
  linkToTaskDetail?: boolean
}

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
}: TaskListProps) {
  return (
    <div id="task-list">
      <div id="task-count">
        {countText ||
          `${tasks.length} Tasks`}
      </div>

      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editingId={editingId}
        />
      ))}
    </div>
  )
}