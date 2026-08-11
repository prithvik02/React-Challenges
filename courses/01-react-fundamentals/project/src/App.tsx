import './App.css'
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import ChallengeList from './components/ChallengeList'
import TaskList from './components/TaskList'
import TaskApp from './components/TaskApp'
import TaskDetailPage from './components/TaskDetailPage'
import FetchDemoView from './components/FetchDemoView'
import { ThemeProvider } from './contexts/ThemeContext'
import type { Task } from './components/TaskList'

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'Description one',
    priority: 'High',
    completed: false,
    category: 'Work',
    tags: ['important', 'work'],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'Description two',
    priority: 'Medium',
    completed: false,
    category: 'Personal',
    tags: ['home'],
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'Description three',
    priority: 'Low',
    completed: false,
    category: 'College',
    tags: ['study'],
  },
  {
    id: 4,
    title: 'Fourth Task',
    description: 'Description four',
    priority: 'Medium',
    completed: false,
    category: 'Work',
    tags: ['project'],
  },
  {
    id: 5,
    title: 'Fifth Task',
    description: 'Description five',
    priority: 'High',
    completed: false,
    category: 'Personal',
    tags: ['important'],
  },
]

function AppContent() {
  const [tasks, setTasks] =
    useState<Task[]>(INITIAL_TASKS)

  const [loaded, setLoaded] =
    useState(false)

  useEffect(() => {
    const savedTasks =
      localStorage.getItem(
        'task-app-tasks'
      )

    if (savedTasks) {
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
        setTasks(INITIAL_TASKS)
      }
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) {
      return
    }

    localStorage.setItem(
      'task-app-tasks',
      JSON.stringify(tasks)
    )
  }, [tasks, loaded])

  const handleDelete = (
    id: string | number
  ) => {
    if (
      window.confirm(
        'Are you sure?'
      )
    ) {
      setTasks(prev =>
        prev.filter(
          task => task.id !== id
        )
      )
    }
  }

  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ChallengeList />
              }
            />

            <Route
              path="/challenge/01-static-task-display"
              element={
                <TaskList
                  tasks={tasks}
                  countText={`${tasks.length} Tasks`}
                />
              }
            />

            <Route
              path="/challenge/02-dynamic-task-rendering"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm={false}
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/03-adding-new-tasks"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/04-task-completion-toggle"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="completed"
                />
              }
            />

            <Route
              path="/challenge/05-task-deletion"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/06-task-filtering"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />

            <Route
              path="/challenge/07-priority-based-sorting"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />

            <Route
              path="/challenge/08-task-editing"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/09-search-functionality"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar={false}
                />
              }
            />

            <Route
              path="/challenge/10-useeffect-local-storage"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/11-useeffect-debounced-search"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />

            <Route
              path="/challenge/12-categories-and-tags"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />

            <Route
              path="/challenge/13-due-dates-and-sorting"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />

            <Route
              path="/challenge/14-task-statistics-dashboard"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showStatsPanel
                />
              }
            />

            <Route
              path="/challenge/15-component-organization"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/16-context-api-theme"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/17-custom-hook-uselocalstorage"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/18-usereducer-complex-state"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/19-performance-optimization"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/20-error-boundaries"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                />
              }
            />

            <Route
              path="/challenge/21-react-router"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  linkToTaskDetail
                />
              }
            />

            <Route
              path="/challenge/21-react-router/task/:id"
              element={
                <TaskDetailPage />
              }
            />

            <Route
              path="/challenge/22-data-fetching"
              element={
                <FetchDemoView />
              }
            />

            <Route
              path="/challenge/23-useref-focus-management"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  countFormat="tasks"
                  showFilterBar
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App