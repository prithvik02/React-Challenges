import TaskList from "./TaskList"

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

  return (
    <div>
      <TaskList
        tasks={tasks}
        countText={`${tasks.length} tasks`}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}