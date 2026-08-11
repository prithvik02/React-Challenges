type Filter =
  | 'all'
  | 'active'
  | 'completed'

type SortOrder =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'
  | 'due-date'

type FilterBarProps = {
  filter: Filter
  onFilterChange: (
    filter: Filter
  ) => void

  sortOrder?: SortOrder

  onSortChange?: (
    sort: SortOrder
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
  filter,
  onFilterChange,
  sortOrder = 'recent',
  onSortChange,
  search = '',
  onSearchChange,
  onClearSearch,
  category = 'all',
  onCategoryChange,
  categories = [],
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        type="button"
        onClick={() =>
          onFilterChange('all')
        }
        data-active={
          filter === 'all'
            ? 'true'
            : 'false'
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
            ? 'true'
            : 'false'
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
            ? 'true'
            : 'false'
        }
      >
        Completed
      </button>

      <select
        id="category-filter"
        value={category}
        onChange={event =>
          onCategoryChange?.(
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

      <input
        id="search-input"
        type="text"
        value={search}
        onChange={event =>
          onSearchChange?.(
            event.target.value
          )
        }
        placeholder="Search tasks"
      />

      {search.length > 0 && (
        <button
          id="clear-search"
          type="button"
          onClick={onClearSearch}
        >
          Clear search
        </button>
      )}

      <select
        id="sort-order"
        value={sortOrder}
        onChange={event =>
          onSortChange?.(
            event.target.value as SortOrder
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
    </div>
  )
}