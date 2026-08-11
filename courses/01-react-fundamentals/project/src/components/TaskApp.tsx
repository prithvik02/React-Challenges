import { useEffect, useState } from 'react'
import TaskList from './TaskList'
import FilterBar from './FilterBar'
import type { Task } from './TaskList'

type TaskAppProps = {
  tasks: Task[]
  setTasks: React.Dispatch<
    React.SetStateAction<Task[]>
  >
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (
    id: string | number
  ) => void
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
    useState<
      'all' | 'active' | 'completed'
    >('all')

  const [categoryFilter, setCategoryFilter] =
    useState('all')

  const [sortOrder, setSortOrder] =
    useState<
      | 'recent'
      | 'priority-high'
      | 'priority-low'
      | 'alphabetical'
    >('recent')

  const [search, setSearch] =
    useState('')

  const [effectiveSearch, setEffectiveSearch] =
    useState('')

  const [editingId, setEditingId] =
    useState<
      string | number | null
    >(null)

  const [newTitle, setNewTitle] =
    useState('')

  const [newDescription, setNewDescription] =
    useState('')

  const [newPriority, setNewPriority] =
    useState('Medium')

  const [newCategory, setNewCategory] =
    useState('General')

  const [newTags, setNewTags] =
    useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEffectiveSearch(search)
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    const savedTasks =
      localStorage.getItem(
        'task-app-tasks'
      )

    if (!savedTasks) {
      return
    }

    try {
      const parsedTasks =
        JSON.parse(savedTasks)

      if (Array.isArray(parsedTasks)) {
        const fixedTasks =
          parsedTasks.map(task => ({
            ...task,
            category:
              typeof task.category ===
              'string'
                ? task.category
                : 'General',
            tags:
              Array.isArray(task.tags)
                ? task.tags
                : [],
          }))

        setTasks(fixedTasks)
      }
    } catch {
      return
    }
  }, [setTasks])

  useEffect(() => {
    localStorage.setItem(
      'task-app-tasks',
      JSON.stringify(tasks)
    )
  }, [tasks])

  const categories = [
    ...new Set(
      tasks
        .map(task => task.category)
        .filter(
          (category): category is string =>
            Boolean(category)
        )
    ),
  ]

  const handleAddTask = () => {
    const title =
      newTitle.trim()

    if (!title) {
      return
    }

    const tags = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const newTask: Task = {
      id: Date.now(),
      title,
      description:
        newDescription.trim(),
      priority: newPriority,
      completed: false,
      category:
        newCategory.trim() ||
        'General',
      tags,
    }

    setTasks(prev => [
      ...prev,
      newTask,
    ])

    setNewTitle('')
    setNewDescription('')
    setNewPriority('Medium')
    setNewCategory('General')
    setNewTags('')
  }

  const handleToggle = (
    id: string | number
  ) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    )
  }

  const handleDelete = (
    id: string | number
  ) => {
    if (onDelete) {
      onDelete(id)
      return
    }

    setTasks(prev =>
      prev.filter(
        task => task.id !== id
      )
    )
  }

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category?: string
      tags?: string[]
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
              category:
                updates.category ||
                'General',
              tags:
                updates.tags || [],
            }
          : task
      )
    )

    setEditingId(null)
  }

  let filteredTasks = tasks

  if (filter === 'active') {
    filteredTasks =
      filteredTasks.filter(
        task => !task.completed
      )
  }

  if (filter === 'completed') {
    filteredTasks =
      filteredTasks.filter(
        task => task.completed
      )
  }

  if (
    categoryFilter !== 'all'
  ) {
    filteredTasks =
      filteredTasks.filter(
        task =>
          (task.category ||
            'General') ===
          categoryFilter
      )
  }

  const searchText =
    effectiveSearch
      .trim()
      .toLowerCase()

  if (searchText) {
    filteredTasks =
      filteredTasks.filter(task => {
        const title =
          task.title.toLowerCase()

        const description =
          (
            task.description ||
            ''
          ).toLowerCase()

        return (
          title.includes(
            searchText
          ) ||
          description.includes(
            searchText
          )
        )
      })
  }

  const sortedTasks =
    [...filteredTasks]

  const getPriorityValue = (
    priority: string
  ) => {
    const value =
      priority.toLowerCase()

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

  if (
    sortOrder ===
    'priority-high'
  ) {
    sortedTasks.sort(
      (a, b) =>
        getPriorityValue(
          String(b.priority)
        ) -
        getPriorityValue(
          String(a.priority)
        )
    )
  }

  if (
    sortOrder ===
    'priority-low'
  ) {
    sortedTasks.sort(
      (a, b) =>
        getPriorityValue(
          String(a.priority)
        ) -
        getPriorityValue(
          String(b.priority)
        )
    )
  }

  if (
    sortOrder ===
    'alphabetical'
  ) {
    sortedTasks.sort(
      (a, b) =>
        a.title
          .toLowerCase()
          .localeCompare(
            b.title.toLowerCase()
          )
    )
  }

  const isSearching =
    search !== effectiveSearch

  return (
    <div>
      {showForm && (
        <div id="task-form">
          <input
            id="task-title"
            type="text"
            value={newTitle}
            onChange={e =>
              setNewTitle(
                e.target.value
              )
            }
            placeholder="Task title"
          />

          <textarea
            id="task-description"
            value={
              newDescription
            }
            onChange={e =>
              setNewDescription(
                e.target.value
              )
            }
            placeholder="Description"
          />

          <select
            id="task-priority"
            value={newPriority}
            onChange={e =>
              setNewPriority(
                e.target.value
              )
            }
          >
            <option value="High">
              High
            </option>
            <option value="Medium">
              Medium
            </option>
            <option value="Low">
              Low
            </option>
          </select>

          <select
            id="task-category"
            value={newCategory}
            onChange={e =>
              setNewCategory(
                e.target.value
              )
            }
          >
            <option value="General">
              General
            </option>
            <option value="Work">
              Work
            </option>
            <option value="Personal">
              Personal
            </option>
            <option value="College">
              College
            </option>
          </select>

          <input
            id="task-tags"
            type="text"
            value={newTags}
            onChange={e =>
              setNewTags(
                e.target.value
              )
            }
            placeholder="Tags separated by commas"
          />

          <button
            onClick={
              handleAddTask
            }
          >
            Add Task
          </button>
        </div>
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={
            setFilter
          }
          sortOrder={sortOrder}
          onSortChange={
            setSortOrder
          }
          search={search}
          onSearchChange={
            setSearch
          }
          onClearSearch={() => {
            setSearch('')
            setEffectiveSearch('')
          }}
          category={
            categoryFilter
          }
          onCategoryChange={
            setCategoryFilter
          }
          categories={
            categories
          }
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
            countFormat ===
            'completed'
              ? `${
                  tasks.filter(
                    task =>
                      task.completed
                  ).length
                } completed`
              : `${sortedTasks.length} tasks`
          }
          onToggle={
            handleToggle
          }
          onDelete={
            handleDelete
          }
          onUpdateTask={
            handleUpdateTask
          }
          editingId={
            editingId
          }
        />
      )}
    </div>
  )
}