const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Middleware for parsing JSON request bodies
const cors = require('cors'); // Middleware for Cross-Origin Resource Sharing
const { Pool } = require('pg'); // PostgreSQL library
require('dotenv').config(); // Import dotenv to use environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 5000; // Define the port for the server to run on

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
});

// Middleware
app.use(bodyParser.json()); // Use JSON parsing middleware
app.use(cors()); // Use CORS to allow cross-origin requests

// API route to fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id'); // Fetch tasks ordered by ID
    res.json(rows); // Send the fetched tasks as JSON
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' }); // Handle errors
  }
});

// API route to add a new task
app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' }); // Validate task text
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (text, completed) VALUES ($1, false) RETURNING *',
      [text]
    );
    res.json(rows[0]); // Return the newly created task
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route to update a task (edit)
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { text, completed } = req.body;

  if (typeof completed !== 'boolean' || !text) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
      [text, completed, taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(rows[0]); // Return the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route to delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
