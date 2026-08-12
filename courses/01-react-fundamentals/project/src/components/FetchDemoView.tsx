import { useEffect, useState } from 'react'

type Todo = {
  id: string | number
  title: string
  completed?: boolean
}

export default function FetchDemoView() {
  const [items, setItems] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const getTodos = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/todos.json')

        if (!response.ok) {
          throw new Error('Request failed')
        }

        const data = await response.json()

        if (!cancelled) {
          setItems(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load todos')
          setLoading(false)
        }
      }
    }

    getTodos()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div id="fetch-loading">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div id="fetch-error">
        {error}
      </div>
    )
  }

  return (
    <div id="fetch-demo">
      <ul id="fetch-list">
        {items.map(item => (
          <li key={item.id}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}