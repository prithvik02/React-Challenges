import { useState } from "react"
import TaskList from "./TaskList"
import FilterBar from "./FilterBar"

type Task = {
  id: string | number
  title: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
}

type TaskAppProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TaskApp({ tasks, setTasks }: TaskAppProps) {
  const [filter, setFilter] =
    useState<'all' | 'active' | 'completed'>('all')

  const [sortOrder, setSortOrder] =
    useState<
      'recent' | 'priority-high' | 'priority-low' | 'alphabetical'
    >('recent')

  const handleToggle = (id: string | number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    )
  }

  const handleDelete = (id: string | number) => {
    setTasks(prev =>
      prev.filter(task => task.id !== id)
    )
  }

  let filteredTasks = tasks

  if (filter === 'active') {
    filteredTasks = tasks.filter(
      task => !task.completed
    )
  }

  if (filter === 'completed') {
    filteredTasks = tasks.filter(
      task => task.completed
    )
  }

  let sortedTasks = [...filteredTasks]

  const priority = {
    high: 3,
    medium: 2,
    low: 1,
  }

  if (sortOrder === 'priority-high') {
    sortedTasks.sort((a, b) => {
      const aPriority = a.priority
        ? priority[a.priority]
        : 0

      const bPriority = b.priority
        ? priority[b.priority]
        : 0

      return bPriority - aPriority
    })
  }

  if (sortOrder === 'priority-low') {
    sortedTasks.sort((a, b) => {
      const aPriority = a.priority
        ? priority[a.priority]
        : 0

      const bPriority = b.priority
        ? priority[b.priority]
        : 0

      return aPriority - bPriority
    })
  }

  if (sortOrder === 'alphabetical') {
    sortedTasks.sort((a, b) =>
      a.title
        .toLowerCase()
        .localeCompare(
          b.title.toLowerCase()
        )
    )
  }

  return (
    <div>
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks match this filter
        </div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          countText={`${sortedTasks.length} tasks`}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}