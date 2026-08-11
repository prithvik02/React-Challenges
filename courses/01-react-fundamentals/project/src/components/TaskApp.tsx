import { useState } from "react"
import TaskList from "./TaskList"
import FilterBar from "./FilterBar"

type Task = {
  id: string | number
  title: string
  description?: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
}

type TaskAppProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  showForm?: boolean
  showFilterBar?: boolean
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm = false,
  showFilterBar = true,
}: TaskAppProps) {
  const [filter, setFilter] =
    useState<'all' | 'active' | 'completed'>('all')

  const [sortOrder, setSortOrder] =
    useState<
      'recent' | 'priority-high' | 'priority-low' | 'alphabetical'
    >('recent')

  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newPriority, setNewPriority] =
    useState<'high' | 'medium' | 'low'>('medium')

  const [editingId, setEditingId] =
    useState<string | number | null>(null)

  const handleAddTask = () => {
    const title = newTitle.trim()

    if (!title) {
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      description: newDescription,
      completed: false,
      priority: newPriority,
    }

    setTasks(prev => [...prev, newTask])

    setNewTitle("")
    setNewDescription("")
    setNewPriority('medium')
  }

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

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
    }
  ) => {
    if (!updates.title.trim()) {
      return
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    )

    setEditingId(null)
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

  const sortedTasks = [...filteredTasks]

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
        .localeCompare(b.title.toLowerCase())
    )
  }

  return (
    <div>
      {showForm && (
        <div id="task-form">
          <input
            id="task-title"
            type="text"
            placeholder="Task title"
            value={newTitle}
            onChange={e =>
              setNewTitle(e.target.value)
            }
          />

          <textarea
            id="task-description"
            placeholder="Description"
            value={newDescription}
            onChange={e =>
              setNewDescription(e.target.value)
            }
          />

          <select
            id="task-priority"
            value={newPriority}
            onChange={e =>
              setNewPriority(
                e.target.value as
                  | 'high'
                  | 'medium'
                  | 'low'
              )
            }
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button onClick={handleAddTask}>
            Add Task
          </button>
        </div>
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}

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
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
        />
      )}
    </div>
  )
}