import { useEffect, useRef } from 'react'
import FormInput from './FormInput'
import Button from './Button'

type FilterValue =
  | 'all'
  | 'active'
  | 'completed'

type SortValue =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'
  | 'due-date'

type FilterBarProps = {
  filter?: FilterValue
  onFilterChange?: (
    filter: FilterValue
  ) => void

  sortOrder?: SortValue
  onSortChange?: (
    sort: SortValue
  ) => void

  search?: string
  onSearchChange?: (
    value: string
  ) => void

  onClearSearch?: () => void

  category?: string
  onCategoryChange?: (
    value: string
  ) => void

  categories?: string[]
}

export default function FilterBar({
  filter = 'all',
  onFilterChange = () => {},
  sortOrder = 'recent',
  onSortChange = () => {},
  search = '',
  onSearchChange = () => {},
  onClearSearch = () => {},
  category = 'all',
  onCategoryChange = () => {},
  categories = [],
}: FilterBarProps) {
  const searchInputRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <div
      data-filter-bar="true"
    >
      <button
        type="button"
        onClick={() =>
          onFilterChange('all')
        }
        data-active={
          filter === 'all'
        }
      >
        All
      </button>

      <button
        type="button"
        onClick={() =>
          onFilterChange('active')
        }
        data-active={
          filter === 'active'
        }
      >
        Active
      </button>

      <button
        type="button"
        onClick={() =>
          onFilterChange('completed')
        }
        data-active={
          filter === 'completed'
        }
      >
        Completed
      </button>

      <FormInput
        label="Search"
        id="search-input"
        type="text"
        value={search}
        onChange={event =>
          onSearchChange(
            event.target.value
          )
        }
        placeholder="Search tasks"
        inputRef={searchInputRef}
      />

      {search.length > 0 && (
        <Button
          id="clear-search"
          onClick={onClearSearch}
          variant="secondary"
        >
          Clear search
        </Button>
      )}

      <label htmlFor="sort-order">
        Sort
      </label>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={event =>
          onSortChange(
            event.target.value as SortValue
          )
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="priority-high">
          Priority: High to Low
        </option>

        <option value="priority-low">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>

        <option value="due-date">
          Due Date (Soonest First)
        </option>
      </select>

      <label htmlFor="category-filter">
        Category
      </label>

      <select
        id="category-filter"
        value={category}
        onChange={event =>
          onCategoryChange(
            event.target.value
          )
        }
      >
        <option value="all">
          All categories
        </option>

        {categories.map(item => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}