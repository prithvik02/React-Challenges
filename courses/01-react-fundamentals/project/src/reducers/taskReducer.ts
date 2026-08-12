import type { Task } from '../components/TaskList'

export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const DELETE_TASK = 'DELETE_TASK'
export const TOGGLE_TASK = 'TOGGLE_TASK'
export const SET_TASKS = 'SET_TASKS'

export type TaskAction =
  | {
      type: typeof ADD_TASK
      payload: Task
    }
  | {
      type: typeof UPDATE_TASK
      payload: {
        id: string | number
        updates: Partial<Task>
      }
    }
  | {
      type: typeof DELETE_TASK
      payload: string | number
    }
  | {
      type: typeof TOGGLE_TASK
      payload: string | number
    }
  | {
      type: typeof SET_TASKS
      payload: Task[]
    }

export function taskReducer(
  state: Task[],
  action: TaskAction
): Task[] {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload]

    case UPDATE_TASK:
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      )

    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload)

    case TOGGLE_TASK:
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      )

    case SET_TASKS:
      return action.payload

    default:
      return state
  }
}