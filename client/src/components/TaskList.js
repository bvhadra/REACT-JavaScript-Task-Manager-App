// Import the React library and the TaskItem component
import React from 'react';
import TaskItem from './TaskItem';

// Define a functional component called TaskList
function TaskList({ tasks, onToggleTaskStatus, onDeleteTask }) {
  return (
    <ul className="task-list">
      {/* Render an unordered list with a class 'task-list' */}
      {tasks.map((task) => (
        // Map through the 'tasks' array and create a TaskItem component for each task
        <TaskItem
          key={task.id}
          task={task}
          onToggleTaskStatus={onToggleTaskStatus}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}

// Export the TaskList component to be used in other parts of the application
export default TaskList;

