import React from 'react';
import '../App.css';

function TaskList({ 
  tasks, 
  deleteTask, 
  startEditing, 
  toggleCompletion, 
  editingTaskId, 
  setEditingText, 
  editingText, 
  editingPriority,
  setEditingPriority,
  saveTask, 
  cancelEditing 
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          {editingTaskId === task.id ? (
            <div className="edit-task">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <select
                value={editingPriority}
                onChange={(e) => setEditingPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button onClick={saveTask}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </div>
          ) : (
            <>
              <span className={`task-priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span className="task-text" onClick={() => toggleCompletion(task.id)}>
                {task.text}
              </span>
              <div className="task-actions">
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;