import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import TaskList from './TaskList'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
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
  showStatsPanel = false,
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
      | 'due-date'
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

  const [newDueDate, setNewDueDate] =
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
            dueDate:
              typeof task.dueDate ===
              'string'
                ? task.dueDate
                : undefined,
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

  const stats = useMemo(() => {
    const total = tasks.length

    const completed =
      tasks.filter(
        task => task.completed
      ).length

    const active =
      tasks.filter(
        task => !task.completed
      ).length

    const overdue =
      tasks.filter(task => {
        if (
          task.completed ||
          !task.dueDate
        ) {
          return false
        }

        const dueDate = new Date(
          task.dueDate
        )

        if (
          Number.isNaN(
            dueDate.getTime()
          )
        ) {
          return false
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        dueDate.setHours(0, 0, 0, 0)

        return dueDate < today
      }).length

    const completedPercentage =
      total > 0
        ? Math.round(
            (completed / total) *
              100
          )
        : 0

    const categories: Record<
      string,
      number
    > = {}

    tasks.forEach(task => {
      const category =
        task.category || 'General'

      categories[category] =
        (categories[category] || 0) +
        1
    })

    const priorities: Record<
      string,
      number
    > = {}

    tasks.forEach(task => {
      const priority =
        task.priority || 'Medium'

      priorities[priority] =
        (priorities[priority] || 0) +
        1
    })

    return {
      total,
      completed,
      completedPercentage,
      active,
      overdue,
      categories,
      priorities,
    }
  }, [tasks])

  const categories = useMemo(
    () =>
      [
        ...new Set(
          tasks
            .map(
              task =>
                task.category
            )
            .filter(
              (
                category
              ): category is string =>
                Boolean(category)
            )
        ),
      ],
    [tasks]
  )

  const handleAddTask = useCallback(() => {
    const title =
      newTitle.trim()

    if (!title) {
      return
    }

    const cleanTags = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(
        tag => tag.length > 0
      )

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
      tags: cleanTags,
      dueDate:
        newDueDate || undefined,
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
    setNewDueDate('')
  }, [
    newTitle,
    newDescription,
    newPriority,
    newCategory,
    newTags,
    newDueDate,
    setTasks,
])

  const handleToggle = useCallback(
    (id: string | number) => {
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
    },
    [setTasks]
  )

  const handleDelete = useCallback(
    (id: string | number) => {
      if (onDelete) {
        onDelete(id)
        return
      }

      setTasks(prev =>
        prev.filter(
          task => task.id !== id
        )
      )
    },
    [onDelete, setTasks]
  )

  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: {
        title: string
        description: string
        priority: string
        category?: string
        tags?: string[]
        dueDate?: string
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
                dueDate:
                  updates.dueDate ||
                  undefined,
              }
            : task
        )
      )

      setEditingId(null)
    },
    [setTasks]
  )

  const sortedTasks = useMemo(() => {
    let result = [...tasks]

    if (filter === 'active') {
      result = result.filter(
        task => !task.completed
      )
    }

    if (filter === 'completed') {
      result = result.filter(
        task => task.completed
      )
    }

    if (
      categoryFilter !== 'all'
    ) {
      result = result.filter(
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
      result = result.filter(task => {
        const title =
          task.title.toLowerCase()

        const description = (
          task.description || ''
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

    const getPriorityValue = (
      value: string
    ) => {
      if (
        value.toLowerCase() ===
        'high'
      ) {
        return 3
      }

      if (
        value.toLowerCase() ===
        'medium'
      ) {
        return 2
      }

      if (
        value.toLowerCase() ===
        'low'
      ) {
        return 1
      }

      return 0
    }

    if (
      sortOrder ===
      'priority-high'
    ) {
      result.sort(
        (a, b) =>
          getPriorityValue(
            b.priority
          ) -
          getPriorityValue(
            a.priority
          )
      )
    }

    if (
      sortOrder ===
      'priority-low'
    ) {
      result.sort(
        (a, b) =>
          getPriorityValue(
            a.priority
          ) -
          getPriorityValue(
            b.priority
          )
      )
    }

    if (
      sortOrder ===
      'alphabetical'
    ) {
      result.sort(
        (a, b) =>
          a.title
            .toLowerCase()
            .localeCompare(
              b.title.toLowerCase()
            )
      )
    }

    if (
      sortOrder ===
      'due-date'
    ) {
      result.sort((a, b) => {
        if (
          !a.dueDate &&
          !b.dueDate
        ) {
          return 0
        }

        if (!a.dueDate) {
          return 1
        }

        if (!b.dueDate) {
          return -1
        }

        return (
          new Date(
            a.dueDate
          ).getTime() -
          new Date(
            b.dueDate
          ).getTime()
        )
      })
    }

    return result
  }, [
    tasks,
    filter,
    categoryFilter,
    effectiveSearch,
    sortOrder,
  ])

  const isSearching = useMemo(
    () =>
      search !== effectiveSearch,
    [search, effectiveSearch]
  )

  const handleClearSearch =
    useCallback(() => {
      setSearch('')
      setEffectiveSearch('')
    }, [])

  return (
    <div>
      {showForm && (
        <div id="task-form">
          <input
            id="task-title"
            type="text"
            value={newTitle}
            onChange={event =>
              setNewTitle(
                event.target.value
              )
            }
            placeholder="Task title"
          />

          <textarea
            id="task-description"
            value={newDescription}
            onChange={event =>
              setNewDescription(
                event.target.value
              )
            }
            placeholder="Description"
          />

          <select
            id="task-priority"
            value={newPriority}
            onChange={event =>
              setNewPriority(
                event.target.value
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
            onChange={event =>
              setNewCategory(
                event.target.value
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
            id="task-tags-input"
            type="text"
            value={newTags}
            onChange={event =>
              setNewTags(
                event.target.value
              )
            }
            placeholder="Tags separated by commas"
          />

          <input
            id="task-due-date"
            type="date"
            value={newDueDate}
            onChange={event =>
              setNewDueDate(
                event.target.value
              )
            }
          />

          <button
            type="button"
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
          onClearSearch={
            handleClearSearch
          }
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

      {showStatsPanel && (
        <StatsPanel
          tasks={tasks}
          stats={stats}
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