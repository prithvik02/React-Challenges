import { useState } from "react"
import TaskList from "./TaskList"
import FilterBar from "./FilterBar"

type Task = {
  id: string | number
  title: string
  completed: boolean
}

type TaskAppProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TaskApp({ tasks, setTasks }: TaskAppProps) {
  const [filter, setFilter] =
    useState<'all' | 'active' | 'completed'>('all')

  const handleToggle = (id: string | number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const handleDelete = (id: string | number) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  let filteredTasks = tasks

  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed)
  }

  if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed)
  }

  return (
    <div>
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
      />

      <div id="task-count">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {filteredTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks match this filter
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          countText={`${filteredTasks.length} tasks`}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}