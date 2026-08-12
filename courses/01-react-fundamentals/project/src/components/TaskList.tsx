import TaskCard from './TaskCard'

export type Task = {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string
}

type TaskListProps = {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category: string
      tags: string[]
      dueDate?: string
    }
  ) => void
  editingId?: string | number | null
  onEdit?: (id: string | number) => void
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First task',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second task',
    priority: 'Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Third task',
    priority: 'Low',
    completed: false,
    category: 'General',
    tags: [],
  },
]

export default function TaskList({
  tasks = defaultTasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onEdit,
}: TaskListProps) {
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  return (
    <section id="task-list">
      <div id="task-count">
        {countText ??
          `${completedCount} of ${tasks.length} completed`}
      </div>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category ?? 'General'}
          tags={task.tags ?? []}
          dueDate={task.dueDate}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editingId={editingId}
          onEdit={onEdit}
        />
      ))}
    </section>
  )
}