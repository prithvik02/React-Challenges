import { useMemo } from 'react'
import TaskCard from './TaskCard'

export type Task = {
  id: string | number
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

type TaskListProps = {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: Partial<Task>
  ) => void
  editingId?: string | number
}

function TaskList({
  tasks = [],
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
}: TaskListProps) {
  const displayedTasks = useMemo(() => {
    return tasks
  }, [tasks])

  return (
    <div id="task-list">
      <div id="task-count">
        {countText || `${displayedTasks.length} Tasks`}
      </div>

      {displayedTasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category || 'General'}
          tags={task.tags || []}
          dueDate={task.dueDate}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editing={editingId === task.id}
        />
      ))}
    </div>
  )
}

export default TaskList