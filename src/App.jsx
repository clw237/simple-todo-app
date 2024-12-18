import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleDragEnd = (result) => {
    // Implement drag and drop logic here
  };

  return (
      <div className="app">
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <TodoList />
      </div>
  );
}

export default App;
