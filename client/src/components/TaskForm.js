// TaskForm.js
import React from 'react';
import '../App.css';

const TaskForm = ({ taskText, setTaskText, addTask }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(); // Add new task
  };

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)} // Handle new task text
          placeholder="Add a new task"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default TaskForm;
