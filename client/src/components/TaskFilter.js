// TaskFilter.js
import React from 'react';
import '../App.css';

const TaskFilter = ({ currentFilter, onChangeFilter }) => {
  return (
    <div className="task-filter">
      <button
        className={currentFilter === 'All' ? 'active' : ''}
        onClick={() => onChangeFilter('All')}
      >
        All
      </button>
      <button
        className={currentFilter === 'Active' ? 'active' : ''}
        onClick={() => onChangeFilter('Active')}
      >
        Active
      </button>
      <button
        className={currentFilter === 'Completed' ? 'active' : ''}
        onClick={() => onChangeFilter('Completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default TaskFilter;
