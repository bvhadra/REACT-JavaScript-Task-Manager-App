import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';

// Define the API base URL
const API_BASE_URL = 'https://react-javascript-task-manager-8032db552129.herokuapp.com/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('All');

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!taskText.trim()) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, { text: taskText });
      setTasks([...tasks, response.data]);
      setTaskText('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  // Save the edited task
  const saveTask = async () => {
    if (!editingText.trim()) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${editingTaskId}`, {
        text: editingText,
        completed: tasks.find(task => task.id === editingTaskId).completed,
      });
      setTasks(tasks.map((task) => (task.id === response.data.id ? response.data : task)));
      cancelEditing();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Cancel editing a task
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  // Toggle completion status of a task
  const toggleCompletion = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? response.data : task)));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Active') return !task.completed;
    return true;
  });

  return (
    <div className="App">
      <Header />
      <div className="content">
        <TaskForm 
          taskText={taskText} 
          setTaskText={setTaskText} 
          addTask={addTask} 
        />
        <TaskFilter currentFilter={filter} onChangeFilter={setFilter} />
        <TaskList 
          tasks={filteredTasks} 
          deleteTask={deleteTask} 
          startEditing={startEditing} 
          toggleCompletion={toggleCompletion}
          editingTaskId={editingTaskId} 
          setEditingText={setEditingText} 
          editingText={editingText} 
          saveTask={saveTask} 
          cancelEditing={cancelEditing}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;