type Filter = 'all' | 'active' | 'completed'

type SortOrder =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'

type FilterBarProps = {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  sortOrder: SortOrder
  onSortChange: (sortOrder: SortOrder) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        onClick={() => onFilterChange('all')}
        data-active={filter === 'all' ? 'true' : 'false'}
      >
        All
      </button>

      <button
        onClick={() => onFilterChange('active')}
        data-active={filter === 'active' ? 'true' : 'false'}
      >
        Active
      </button>

      <button
        onClick={() => onFilterChange('completed')}
        data-active={filter === 'completed' ? 'true' : 'false'}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) =>
          onSortChange(e.target.value as SortOrder)
        }
      >
        <option value="recent">Recently Added</option>
        <option value="priority-high">Priority: High to Low</option>
        <option value="priority-low">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  )
}