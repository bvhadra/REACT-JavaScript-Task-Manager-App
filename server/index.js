const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

/*
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});


async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        priority VARCHAR(10) DEFAULT 'Medium'
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://react-javascript-task-manager-8032db552129.herokuapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { text, priority } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (text, completed, priority) VALUES ($1, false, $2) RETURNING *',
      [text, priority || 'Medium']
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { text, completed, priority } = req.body;
  if (typeof completed !== 'boolean' || !text) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET text = $1, completed = $2, priority = $3 WHERE id = $4 RETURNING *',
      [text, completed, priority || 'Medium', taskId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'unhealthy', details: error.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});