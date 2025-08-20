import React, { useMemo, useState } from "react";

// FIXED: Added proper TypeScript interfaces for type safety
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed" | "multiword";

// NEW: Separate TodoItem component for better organization and reusability
interface TodoItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

function TodoItem({ task, onToggle, onRemove }: TodoItemProps) {
  return (
    <li style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "1px solid #eee"
    }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          marginRight: "10px"
        }}
      >
        {task.text}
      </span>
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          onRemove(task.id);
        }}
        style={{
          color: "#dc3545",
          textDecoration: "none",
          fontWeight: "bold",
          marginLeft: "auto"
        }}
      >
        [x]
      </a>
    </li>
  );
}

// FIXED: All major issues addressed:
// ✅ Performance improved with proper useMemo dependencies  
// ✅ Added missing functionality (remove items, clear completed, multi-word filter)
// ✅ Properly centered on the page with responsive layout
// ✅ Code quality improved (proper key props, TypeScript types, simplified logic)
// ✅ Extracted TodoItem into separate reusable component
export function ClunkyTodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Write code", completed: true },
    { id: 3, text: "Eat lunch", completed: false },
  ]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      // FIXED: Simplified state update using functional setter
      setTasks(prev => [...prev, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleToggleComplete = (id: number) => {
    // FIXED: Simplified state update with spread operator
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // NEW: Add function to remove individual tasks
  const handleRemoveTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // NEW: Add function to clear all completed tasks
  const handleClearCompleted = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  // FIXED: Replaced inefficient separate state with computed value using useMemo
  const tasksToRender = useMemo(() => {
    let filteredTasks = tasks;
    
    // Apply status filter
    if (filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (filter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (filter === "multiword") {
      // NEW: Multi-word filter - items with 2 or more words
      filteredTasks = filteredTasks.filter((task) => task.text.trim().split(/\s+/).length >= 2);
    }
    
    return filteredTasks;
  }, [tasks, filter]); // FIXED: Now properly depends on both tasks and filter

  // FIXED: Added proper dependencies to useMemo
  const totalCount = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  return (
    // FIXED: Added proper centering styles and improved layout
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      textAlign: "center"
    }}>
      <h1>To-Do List</h1>
      <h2>Items: {totalCount}</h2>
      <input
        type="text"
        value={newTask}
        onChange={handleInputChange}
        placeholder="Add new task"
      />
      <button onClick={handleAddTask}>Add</button>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        {/* NEW: Multi-word filter button */}
        <button onClick={() => setFilter("multiword")}>Multi-word</button>
      </div>
      
      {/* NEW: Clear completed button */}
      <div style={{ marginTop: "10px" }}>
        <button 
          onClick={handleClearCompleted}
          disabled={!tasks.some(task => task.completed)}
          style={{ 
            backgroundColor: tasks.some(task => task.completed) ? "#dc3545" : "#666",
            color: "white"
          }}
        >
          Clear Completed ({tasks.filter(task => task.completed).length})
        </button>
      </div>
      <ul style={{
        listStyle: "none",
        padding: 0,
        textAlign: "left",
        marginTop: "20px"
      }}>
        {/* FIXED: Extracted list item into reusable TodoItem component */}
        {tasksToRender.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onToggle={handleToggleComplete}
            onRemove={handleRemoveTask}
          />
        ))}
      </ul>
    </div>
  );
}
