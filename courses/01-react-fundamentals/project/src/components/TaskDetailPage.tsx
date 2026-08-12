import { useParams, useNavigate } from 'react-router-dom'
import type { Task } from './TaskList'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  let task: Task | undefined

  try {
    const savedTasks = localStorage.getItem('task-app-tasks')

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)

      if (Array.isArray(parsedTasks)) {
        task = parsedTasks.find(
          item => String(item.id) === String(id)
        )
      }
    }
  } catch {
    task = undefined
  }

  if (!task) {
    return (
      <div id="task-detail-page">
        <h2>Task not found</h2>

        <button
          id="task-detail-back"
          type="button"
          onClick={() =>
            navigate('/challenge/21-react-router')
          }
        >
          Back to list
        </button>
      </div>
    )
  }

  return (
    <main id="task-detail-page">
      <button
        id="task-detail-back"
        type="button"
        onClick={() =>
          navigate('/challenge/21-react-router')
        }
      >
        Back to list
      </button>

      <h1>{task.title}</h1>

      <p>{task.description}</p>

      <p>
        <strong>Priority:</strong> {task.priority}
      </p>

      <p>
        <strong>Category:</strong>{' '}
        {task.category || 'General'}
      </p>

      {task.tags && task.tags.length > 0 && (
        <div id="task-detail-tags">
          <strong>Tags:</strong>

          {task.tags.map((tag, index) => (
            <span key={`${tag}-${index}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.dueDate && (
        <p>
          <strong>Due Date:</strong>{' '}
          {new Date(
            task.dueDate
          ).toLocaleDateString()}
        </p>
      )}

      <p>
        <strong>Status:</strong>{' '}
        {task.completed
          ? 'Completed'
          : 'Active'}
      </p>
    </main>
  )
}