// components/TodoItem.jsx
import React from 'react';

function TodoItem({ task, index, onDelete, onMoveUp, onMoveDown }) {
  return (
        <li key={index} className='task-item'>
          <span className="category">{task.category}</span>
          <span className="text">{task.text}</span>
          
          <button onClick={onDelete} className="delete-button">Delete</button>
          <button onClick={onMoveUp} className="move-button">👆</button>
          <button onClick={onMoveDown} className="move-button">👇</button>
        </li>
  );
}

export default TodoItem;
