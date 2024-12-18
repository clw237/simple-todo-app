import React, { useState, useEffect, useCallback } from 'react'; 
import TodoItem from './TodoItem';

// Define the categories available for tasks
const CATEGORIES = ['Select a category', 'All', 'Work', 'Personal', 'Shopping'];

// Initial state for the TodoList component
const INITIAL_STATE = { 
    tasks: [], // Array to hold tasks
    newTask: '', // Input value for new task
    categories: CATEGORIES, // Available categories
    selectedCategory: 'Select a category' // Currently selected category
};

// Main TodoList functional component
const TodoList = () => {
    const [state, setState] = useState(INITIAL_STATE); // State management using useState

    // Load tasks from local storage when the component mounts
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]'); // Retrieve tasks from local storage
        setState(prevState => ({ ...prevState, tasks: storedTasks })); // Update state with stored tasks
    }, []);

    // Save tasks to local storage whenever tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks)); // Store current tasks in local storage
    }, [state.tasks]);

    // Handle input change for new task input field
    const handleInputChange = useCallback((e) => {
        setState(prevState => ({ ...prevState, newTask: e.target.value })); // Update newTask state with input value
    }, []);

    // Handle category selection change
    const handleCategoryChange = useCallback((e) => {
        setState(prevState => ({ ...prevState, selectedCategory: e.target.value })); // Update selectedCategory state
    }, []);

    // Add a new task to the task list
    const addTask = useCallback(() => {
        if (state.newTask.trim()) { // Check if new task is not empty
            setState(prevState => ({
                ...prevState,
                tasks: [
                    ...prevState.tasks,
                    { 
                        id: Date.now().toString(), // Unique ID for the task based on timestamp
                        text: prevState.newTask, // Task text from input field
                        category: prevState.selectedCategory === 'Select a category' ? 'All' : prevState.selectedCategory // Default to 'All' if no category is selected
                    }
                ],
                newTask: '', // Reset input field after adding task
                selectedCategory: 'Select a category' // Reset selected category after adding task
            }));
        }
    }, [state.newTask, state.selectedCategory]);

    // Handle key down events in the input field (e.g., pressing Enter)
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') addTask(); // Call addTask if Enter key is pressed
    }, [addTask]);

    // Delete a task by its ID
    const deleteTask = useCallback((id) => {
        setState(prevState => ({ 
            ...prevState, 
            tasks: prevState.tasks.filter(task => task.id !== id) // Filter out the task with the given ID from the list of tasks 
        }));
    }, []);

    // Declare filteredTasks once based on the selected category
    const filteredTasks = ['All', 'Select a category'].includes(state.selectedCategory)
        ? state.tasks // If 'All' or placeholder is selected, show all tasks
        : state.tasks.filter(task => ['All', state.selectedCategory].includes(task.category)); // Otherwise, filter tasks by selected category

    // Move a task up or down in the list based on its current position and direction specified (-1 for up, 1 for down)
    const moveTask = useCallback((taskId, direction) => {
        setState(prevState => {
            const currentIndex = filteredTasks.findIndex(task => task.id === taskId); // Find index of the task in filtered list
            const newIndex = currentIndex + direction; // Calculate new index based on direction

            // Ensure newIndex is valid for both filtered and original tasks
            if (currentIndex >= 0 && newIndex >= 0 && newIndex < filteredTasks.length) {
                const newTasks = [...prevState.tasks]; // Create a copy of the original tasks array

                // Swap tasks in the original array based on their indices in the filtered list
                [newTasks[prevState.tasks.indexOf(filteredTasks[currentIndex])], newTasks[prevState.tasks.indexOf(filteredTasks[newIndex])]] =
                [newTasks[prevState.tasks.indexOf(filteredTasks[newIndex])], newTasks[prevState.tasks.indexOf(filteredTasks[currentIndex])]];

                return { ...prevState, tasks: newTasks }; // Return updated state with modified tasks array
            }
            return prevState; // No change if invalid index 
        });
    }, [filteredTasks]);

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    className="task-input"
                    placeholder="Enter a new task"
                    value={state.newTask} // Controlled input value linked to state.newTask
                    onKeyDown={handleKeyDown} // Event handler for key down events in input field
                    onChange={handleInputChange} // Event handler for changes in input field
                />
                <select 
                    onChange={handleCategoryChange} // Event handler for changing selected category
                    className={`category-select ${state.selectedCategory === 'Select a category' ? 'placeholder' : ''}`} 
                    aria-label="Select a category for your task" 
                    value={state.selectedCategory} // Controlled select value linked to state.selectedCategory 
                >
                    {state.categories.map(category => (
                        <option 
                            key={category} 
                            value={category} 
                            disabled={category === 'Select a category'} // Disable placeholder option to prevent selection 
                        >
                            {category}
                        </option>
                    ))}
                </select>
                <button onClick={addTask} className="add-button">Add Task</button> {/* Button to add a new task */}
            </div>
            <ol className="task-grid">
                {filteredTasks.map(task => (
                    <TodoItem 
                        key={task.id} 
                        task={task} 
                        onDelete={() => deleteTask(task.id)} // Pass delete function to TodoItem component 
                        onMoveUp={() => moveTask(task.id, -1)} // Pass move up function to TodoItem component 
                        onMoveDown={() => moveTask(task.id, 1)}  // Pass move down function to TodoItem component 
                    />
                ))}
            </ol>
        </div>
    );
};

export default TodoList;  // Exporting TodoList component for use in other parts of the application.
