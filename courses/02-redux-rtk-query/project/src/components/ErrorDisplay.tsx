interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'error' in error &&
    typeof error.error === 'string'
  ) {
    return error.error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return 'Failed to load data.'
}

export default function ErrorDisplay({
  error,
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div
      data-testid="error-display"
      style={{
        padding: '1rem',
        border: '1px solid #dc2626',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <p>
        {getErrorMessage(error)}
      </p>

      {onRetry && (
        <button
          type="button"
          data-testid="retry-btn"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  )
}