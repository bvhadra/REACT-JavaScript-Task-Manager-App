import React from 'react';
import TaskItem from './TaskItem';
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
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          startEditing={startEditing}
          toggleCompletion={toggleCompletion}
          editingTaskId={editingTaskId}
          editingText={editingText}
          setEditingText={setEditingText}
          editingPriority={editingPriority}
          setEditingPriority={setEditingPriority}
          saveTask={saveTask}
          cancelEditing={cancelEditing}
        />
      ))}
    </ul>
  );
}

export default TaskList;