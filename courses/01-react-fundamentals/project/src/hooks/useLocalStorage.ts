import {
  useCallback,
  useState,
} from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedValue = localStorage.getItem(key)

      if (savedValue === null) {
        return initialValue
      }

      return JSON.parse(savedValue) as T
    } catch {
      return initialValue
    }
  })

  const updateValue = useCallback(
    (newValue: T | ((previousValue: T) => T)) => {
      setValue(previousValue => {
        const valueToStore =
          typeof newValue === 'function'
            ? (
                newValue as (
                  previousValue: T
                ) => T
              )(previousValue)
            : newValue

        try {
          localStorage.setItem(
            key,
            JSON.stringify(valueToStore)
          )
        } catch {
          return valueToStore
        }

        return valueToStore
      })
    },
    [key]
  )

  return [value, updateValue] as const
}