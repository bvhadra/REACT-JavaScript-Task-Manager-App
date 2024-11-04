import React from 'react';
import '../App.css';

function TaskItem({ 
  task, 
  deleteTask, 
  startEditing, 
  toggleCompletion, 
  editingTaskId, 
  editingText, 
  setEditingText, 
  saveTask, 
  cancelEditing 
}) {
  const isEditing = editingTaskId === task.id;

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-info">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => toggleCompletion(task.id)} 
        />
        <span className={`task-priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {isEditing ? (
          <input 
            type="text" 
            value={editingText} 
            onChange={(e) => setEditingText(e.target.value)} 
            className="editing-input"
          />
        ) : (
          <span className="task-text">{task.text}</span>
        )}
      </div>
      <div className="task-buttons">
        {isEditing ? (
          <>
            <button onClick={saveTask}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => startEditing(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;