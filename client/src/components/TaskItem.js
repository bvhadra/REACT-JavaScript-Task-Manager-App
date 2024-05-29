// Import the React library
import React from 'react';

// Define a functional component called TaskItem
function TaskItem({ task, onDeleteTask, onToggleTaskStatus }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {/* Render a list item with a class 'task-item' and 'completed' if the task is completed */}
      <div className="task-info">
        {/* Create a div for task information */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTaskStatus(task.id, task.completed)}
        />
        {/* Create a checkbox input with checked status and an onChange event */}
        <span>{task.text}</span>
        {/* Display the task text */}
      </div>
      <button onClick={() => onDeleteTask(task.id)}>Delete</button>
      {/* Create a 'Delete' button with an onClick event */}
    </li>
  );
}

// Export the TaskItem component to be used in other parts of the application
export default TaskItem;

