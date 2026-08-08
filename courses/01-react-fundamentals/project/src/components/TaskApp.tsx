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
}: TaskAppProps) {
  const handleAddTask = (task: Task) => {
    if (!setTasks) return

    setTasks((previousTasks) => [...previousTasks, task])
  }

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      <TaskList tasks={tasks} />
    </div>
  )
}