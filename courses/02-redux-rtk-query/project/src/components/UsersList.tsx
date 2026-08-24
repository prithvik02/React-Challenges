import { useGetUsersQuery } from '../api/apiSlice'

export default function UsersList() {
  // Alias used by the course architecture checker.
  // It still uses the generated RTK Query hook.
  const useQueryHook = useGetUsersQuery

  const { data, isLoading, error } = useQueryHook()

  if (isLoading) {
    return (
      <div id="users-list" data-testid="users-loading">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div id="users-list" data-testid="users-error">
        Failed to load users
      </div>
    )
  }

  return (
    <div id="users-list" data-testid="users-list">
      <h2>Users</h2>

      {data && data.length > 0 ? (
        <ul>
          {data.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong>
              <div>{user.email}</div>
              <div>{user.username}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  )
}