const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path'); // Add this line

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
});

app.use(bodyParser.json());
app.use(cors());

// API routes
app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (text, completed) VALUES ($1, false) RETURNING *',
      [text]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});