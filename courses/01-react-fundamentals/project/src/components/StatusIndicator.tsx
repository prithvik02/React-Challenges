type StatusIndicatorProps = {
  status:
    | 'overdue'
    | 'due-today'
    | 'due-soon'
    | 'completed'
}

export default function StatusIndicator({
  status,
}: StatusIndicatorProps) {
  const labels = {
    overdue: 'Overdue',
    'due-today': 'Due Today',
    'due-soon': 'Due Soon',
    completed: 'Completed',
  }

  return (
    <span
      className="status-indicator"
      data-status={status}
    >
      {labels[status]}
    </span>
  )
}