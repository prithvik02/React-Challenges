import { useEffect, useState } from 'react'
import TaskList from './TaskList'
import FilterBar from './FilterBar'
import type { Task } from './TaskList'

type TaskAppProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm = false,
  countFormat = 'tasks',
  showFilterBar = true,
  onDelete,
}: TaskAppProps) {
  const [filter, setFilter] =
    useState<'all' | 'active' | 'completed'>('all')

  const [sortOrder, setSortOrder] =
    useState<
      'recent' | 'priority-high' | 'priority-low' | 'alphabetical'
    >('recent')

  const [search, setSearch] = useState('')
  const [effectiveSearch, setEffectiveSearch] = useState('')

  const [editingId, setEditingId] =
    useState<string | number | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState('Medium')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEffectiveSearch(search)
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [search])

  const isSearching = search !== effectiveSearch

  const handleAddTask = () => {
    const title = newTitle.trim()

    if (!title) {
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      description: newDescription,
      priority: newPriority,
      completed: false,
    }

    setTasks(prev => [...prev, newTask])

    setNewTitle('')
    setNewDescription('')
    setNewPriority('Medium')
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
    if (onDelete) {
      onDelete(id)
      return
    }

    setTasks(prev =>
      prev.filter(task => task.id !== id)
    )
  }

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
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

  const searchText =
    effectiveSearch.trim().toLowerCase()

  if (searchText) {
    filteredTasks = filteredTasks.filter(task => {
      const title =
        task.title.toLowerCase()

      const description =
        (task.description || '').toLowerCase()

      return (
        title.includes(searchText) ||
        description.includes(searchText)
      )
    })
  }

  const sortedTasks = [...filteredTasks]

  const getPriorityValue = (priority: string) => {
    const value = priority.toLowerCase()

    if (value === 'high') {
      return 3
    }

    if (value === 'medium') {
      return 2
    }

    if (value === 'low') {
      return 1
    }

    return 0
  }

  if (sortOrder === 'priority-high') {
    sortedTasks.sort(
      (a, b) =>
        getPriorityValue(String(b.priority)) -
        getPriorityValue(String(a.priority))
    )
  }

  if (sortOrder === 'priority-low') {
    sortedTasks.sort(
      (a, b) =>
        getPriorityValue(String(a.priority)) -
        getPriorityValue(String(b.priority))
    )
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
      {showForm && (
        <div id="task-form">
          <input
            id="task-title"
            type="text"
            value={newTitle}
            onChange={e =>
              setNewTitle(e.target.value)
            }
            placeholder="Task title"
          />

          <textarea
            id="task-description"
            value={newDescription}
            onChange={e =>
              setNewDescription(e.target.value)
            }
            placeholder="Description"
          />

          <select
            id="task-priority"
            value={newPriority}
            onChange={e =>
              setNewPriority(e.target.value)
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
          search={search}
          onSearchChange={setSearch}
          onClearSearch={() => {
            setSearch('')
            setEffectiveSearch('')
          }}
        />
      )}

      {isSearching && (
        <div id="searching-indicator">
          Searching...
        </div>
      )}

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks found
        </div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          countText={
            countFormat === 'completed'
              ? `${tasks.filter(task => task.completed).length} completed`
              : `${sortedTasks.length} tasks`
          }
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
        />
      )}
    </div>
  )
}