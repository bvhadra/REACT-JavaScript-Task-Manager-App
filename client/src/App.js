// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';

function App() {
  // Define state variables using React hooks
  const [tasks, setTasks] = useState([]); // Store the list of tasks
  const [filter, setFilter] = useState('All'); // Store the selected filter option

  // Use useEffect to fetch tasks from the server when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data); // Update the tasks state with the fetched data
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to add a new task
  const addTask = async (taskText) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        text: taskText,
      });
      setTasks([...tasks, response.data]); // Add the new task to the tasks state
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to toggle the completion status of a task
  const toggleTaskStatus = async (taskId, completed) => {
    try {
      const newCompleted = !completed; // Toggle the completed status
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        completed: newCompleted,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: newCompleted } : task
      );
      setTasks(updatedTasks); // Update the tasks state with the updated task status
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks); // Update the tasks state by removing the deleted task
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  // Render the UI components
  return (
    <div className="App">
      <Header />
      <TaskForm onAddTask={addTask} />
      <TaskFilter currentFilter={filter} onChangeFilter={setFilter} />
      <TaskList
        tasks={filteredTasks}
        onToggleTaskStatus={toggleTaskStatus}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;

