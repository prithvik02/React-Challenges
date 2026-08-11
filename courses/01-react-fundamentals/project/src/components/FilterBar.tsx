type Filter = 'all' | 'active' | 'completed';

type FilterBarProps = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

function FilterBar({ filter, onFilterChange }: FilterBarProps) {
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
    </div>
  );
}

export default FilterBar;