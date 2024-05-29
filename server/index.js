const express = require('express');  // Import the Express framework
const bodyParser = require('body-parser');  // Middleware for parsing JSON request bodies
const { Pool } = require('pg');  // PostgreSQL library

const app = express();  // Create an Express application
const port = process.env.PORT || 5000;  // Define the port for the server to run on

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  password: 'Bullion1',
  host: 'localhost',
  port: 5432,  // PostgreSQL default port
  database: 'taskmanager',  // Name of the database
});

app.use(bodyParser.json());  // Use JSON parsing middleware

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allowed request headers
  next();
});

// Define API routes for tasks
app.get('/api/tasks', async (req, res) => {
  try {
    // Query the database to fetch all tasks
    const { rows } = await pool.query('SELECT * FROM tasks');

    // Respond with the fetched tasks as JSON
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });  // Handle errors and return a 500 status code
  }
});

app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  try {
    // Insert a new task with a default "completed" value of false into the database
    const { rows } = await pool.query(
      'INSERT INTO tasks (text, completed) VALUES ($1, false) RETURNING *',
      [text]
    );

    // Respond with the newly created task as JSON
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task completion status route
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body; // Get the completed value from the request body
  try {
    // Use the received `completed` value to update the task
    const { rows } = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, taskId]
    );

    // Respond with the updated task as JSON
    res.json(rows[0]);
  } catch (error) {
    console.error('Error toggling task status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task completion status route
/*
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    // Toggle the completion status of the task by using "NOT completed"
    const { rows } = await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
      [taskId]
    );

    // Respond with the updated task as JSON
    res.json(rows[0]);
  } catch (error) {
    console.error('Error toggling task status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

// Delete task route
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    // Delete the task from the database by ID
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    // Respond with the deleted task's ID as JSON
    res.json({ id: taskId });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/*
This code sets up a Node.js server using the Express framework, connects to a PostgreSQL database, and defines API routes for managing tasks. Here's a breakdown of what the code does:

Import required modules and libraries.

Create an Express application and define the port for the server to run on (default is 5000).

Configure the PostgreSQL connection using the pg.Pool class with connection details such as username, password, host, port, and database name.

Use the body-parser middleware to parse JSON request bodies.

Implement CORS (Cross-Origin Resource Sharing) middleware to allow cross-origin requests.

Define API routes:

GET /api/tasks: Fetch all tasks from the database.
POST /api/tasks: Add a new task with a default "completed" value of false.
PUT /api/tasks/:id: Update the completion status of a task based on the provided completed value.
DELETE /api/tasks/:id: Delete a task from the database by its ID.
Handle errors and return appropriate HTTP status codes (e.g., 500 for internal server errors).

Start the Express server, and it listens on the specified port (5000 in this case).

This code sets up the server-side logic for handling task management operations through API routes.

*/