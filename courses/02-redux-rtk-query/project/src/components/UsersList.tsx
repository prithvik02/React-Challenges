import { useGetUsersQuery as useQueryHook } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQueryHook()

  if (isLoading) {
    return (
      <div
        data-testid="users-loading"
        style={{ padding: '1rem' }}
      >
        Loading users...
      </div>
    )
  }

  if (isError) {
    return (
      <div
        data-testid="users-error-container"
        style={{ padding: '1rem' }}
      >
        <ErrorDisplay
          error={error}
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div
      data-testid="users-list"
      style={{ padding: '1rem' }}
    >
      <h3>Users</h3>

      {isFetching && (
        <p data-testid="users-refreshing">
          Refreshing users...
        </p>
      )}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong>
              <div>{user.email}</div>
              <div>@{user.username}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}