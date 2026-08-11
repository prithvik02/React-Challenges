import type { Task } from './TaskList'

type StatsPanelProps = {
  tasks?: Task[]
  total?: number
  completed?: number
  active?: number
  overdue?: number
}

export default function StatsPanel({
  tasks = [],
  total,
  completed,
  active,
  overdue,
}: StatsPanelProps) {
  const totalTasks =
    total !== undefined ? total : tasks.length

  const completedTasks =
    completed !== undefined
      ? completed
      : tasks.filter(task => task.completed).length

  const activeTasks =
    active !== undefined
      ? active
      : tasks.filter(task => !task.completed).length

  const overdueTasks =
    overdue !== undefined
      ? overdue
      : tasks.filter(task => {
          if (task.completed || !task.dueDate) {
            return false
          }

          const date = new Date(task.dueDate)

          if (Number.isNaN(date.getTime())) {
            return false
          }

          const today = new Date()

          today.setHours(0, 0, 0, 0)
          date.setHours(0, 0, 0, 0)

          return date < today
        }).length

  const percentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

  return (
    <div id="stats-panel">
      <h2>Task Statistics</h2>

      <div>
        Total: {totalTasks}
      </div>

      <div>
        Completed: {completedTasks}
      </div>

      <div>
        Active: {activeTasks}
      </div>

      <div>
        Overdue: {overdueTasks}
      </div>

      <div>
        Completion: {percentage}%
      </div>

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}