// Import React library to create a React component
import React from 'react';

// Define a functional component called TaskFilter
function TaskFilter({ currentFilter, onChangeFilter }) {
  // Define an array of filter options
  const filters = ['All', 'Active', 'Completed'];

  // Render a div containing buttons for each filter option
  return (
    <div className="task-filter">
      {filters.map((filter) => (
        <button
          key={filter}
          className={currentFilter === filter ? 'active' : ''} // Apply 'active' class if the current filter matches
          onClick={() => onChangeFilter(filter)} // Trigger the onChangeFilter function when a button is clicked
        >
          {filter} {/* Display the filter option text */}
        </button>
      ))}
    </div>
  );
}

// Export the TaskFilter component to be used in other parts of the application
export default TaskFilter;
