// Import React library and useState hook to create a React component with state
import React, { useState } from 'react';

// Define a functional component called TaskForm
function TaskForm({ onAddTask }) {
  // Initialize a state variable 'taskText' to store the input text
  const [taskText, setTaskText] = useState('');

  // Define a function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (taskText.trim() === '') {
      return; // Prevent adding empty tasks
    }

    onAddTask(taskText); // Call the 'onAddTask' function with the task text
    setTaskText(''); // Clear the input field after adding the task
  };

  // Render a div containing a form with an input field and an 'Add' button
  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)} // Update 'taskText' on input change
        />
        <button type="submit">Add</button> {/* Submit the form on button click */}
      </form>
    </div>
  );
}

// Export the TaskForm component to be used in other parts of the application
export default TaskForm;
