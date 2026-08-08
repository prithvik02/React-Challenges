import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks = [],
  setTasks,
  showForm = false,
  countFormat = 'tasks',
}: TaskAppProps) {
  const handleAddTask = (task: Task) => {
    if (!setTasks) return

    setTasks((previousTasks) => [...previousTasks, task])
  }

  const handleToggle = (id: string | number) => {
    if (!setTasks) return

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const countText =
    countFormat === 'completed'
      ? `${tasks.filter((task) => task.completed).length} of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      <TaskList
        tasks={tasks}
        countText={countText}
        onToggle={handleToggle}
      />
    </div>
  )
}