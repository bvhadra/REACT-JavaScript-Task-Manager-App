import React from 'react';
import '../App.css';

const TaskForm = ({ taskText, setTaskText, taskPriority, setTaskPriority, addTask, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
          required
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;