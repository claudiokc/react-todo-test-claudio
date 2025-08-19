import React, { useEffect, useMemo, useState } from "react";

// TODO: This component has multiple issues that need to be addressed:
// 1. Poor performance due to unnecessary state and incorrect dependencies
// 2. Missing functionality (remove items, clear completed, multi-word filter) 
// 3. Not properly centered on the page
// 4. Should be broken into smaller, reusable components
// 5. Code quality issues (wrong key prop, any types, unnecessary complexity)
export function ClunkyTodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Write code", completed: true },
    { id: 3, text: "Eat lunch", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      // TODO: Unnecessary complexity - using temp array instead of direct state update
      // Could be simplified to: setTasks(prev => [...prev, { id: Date.now(), text: newTask, completed: false }])
      const tempTasks = [...tasks];
      tempTasks.push({ id: Date.now(), text: newTask, completed: false });
      setTasks(tempTasks);
      setNewTask("");
    }
  };

  const handleToggleComplete = (id) => {
    // TODO: Overly complex state update with unnecessary object creation
    // Could be simplified to: task.id === id ? { ...task, completed: !task.completed } : task
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        let tempTask = { id: task.id, text: task.text, completed: task.completed };
        tempTask.completed = !tempTask.completed;
        return tempTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // TODO: Inefficient approach using separate state for filtered tasks
  // Should be computed value using useMemo instead of additional state
  const [tasksToRender, setTasksToRender] = useState<any[]>([])
  useEffect(() => {
    // TODO: CRITICAL BUG - Missing 'filter' in dependency array!
    // Filter changes won't update the display because useEffect doesn't re-run
    let filteredTasks = tasks;
    if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === "active") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }
    // TODO: Missing feature - no filter for items with 2+ words
    setTasksToRender(filteredTasks);
  }, [tasks]); // TODO: Should include 'filter' in dependencies

  // TODO: PERFORMANCE BUG - useMemo missing dependencies!
  // Empty dependency array means this never updates when tasks change
  const totalCount = useMemo(() => {
    return tasks.length;
  }, []); // TODO: Should be [tasks]

  return (
    // TODO: Not centered on page - needs CSS styling for horizontal/vertical centering
    <div>
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
        {/* TODO: Missing "Multi-word" filter button for items with 2+ words */}
        {/* TODO: Missing "Clear Completed" button to remove all completed items */}
      </div>
      <ul>
        {/* TODO: CRITICAL BUG - Using array index as key instead of unique task.id */}
        {/* TODO: List item should be extracted into separate component for reusability */}
        {tasksToRender.map((task, index) => (
          <li key={index}> {/* TODO: Should be key={task.id} */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            {/* TODO: Missing [x] remove button for individual items */}
          </li>
        ))}
      </ul>
    </div>
  );
}
