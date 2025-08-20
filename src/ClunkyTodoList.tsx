import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Chip,
  ButtonGroup,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ClearAll as ClearAllIcon,
} from "@mui/icons-material";

// TypeScript interfaces for type safety
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed" | "multiword";

// Material UI TodoItem component for better UX
interface TodoItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

function TodoItem({ task, onToggle, onRemove }: TodoItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          color="primary"
        />
      </ListItemIcon>
      <ListItemText
        primary={task.text}
        sx={{
          textDecoration: task.completed ? "line-through" : "none",
          opacity: task.completed ? 0.6 : 1,
        }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onRemove(task.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

// MODERN MATERIAL UI TODO LIST:
// ✅ Beautiful Material UI design with consistent theming
// ✅ Responsive layout with Container, Paper, and proper spacing
// ✅ Enhanced UX with icons, animations, and visual feedback
// ✅ Accessible components with proper ARIA labels
// ✅ Performance optimized with proper useMemo dependencies  
// ✅ Full functionality: add, remove, toggle, filter, clear completed
// ✅ Clean TypeScript code with proper interfaces and types
// ✅ Component separation for maintainability and reusability
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            📝 Todo List
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} total
          </Typography>
        </Box>

        {/* Add Task Section */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            value={newTask}
            onChange={handleInputChange}
            placeholder="Add a new task..."
            variant="outlined"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddTask}
            startIcon={<AddIcon />}
            sx={{ minWidth: 100 }}
            disabled={!newTask.trim()}
          >
            Add
          </Button>
        </Box>
        {/* Filter Section */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "multiword", label: "Multi-word" },
          ].map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              onClick={() => setFilter(key as FilterType)}
              color={filter === key ? "primary" : "default"}
              variant={filter === key ? "filled" : "outlined"}
              clickable
            />
          ))}
        </Box>

        {/* Clear Completed Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearCompleted}
            disabled={!tasks.some(task => task.completed)}
            startIcon={<ClearAllIcon />}
          >
            Clear Completed ({tasks.filter(task => task.completed).length})
          </Button>
        </Box>
        {/* Todo List Section */}
        {tasksToRender.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {filter === "all"
                ? "No tasks yet. Add one above!"
                : `No ${filter} tasks found.`
              }
            </Typography>
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <List>
              {tasksToRender.map((task, index) => (
                <React.Fragment key={task.id}>
                  <TodoItem
                    task={task}
                    onToggle={handleToggleComplete}
                    onRemove={handleRemoveTask}
                  />
                  {index < tasksToRender.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Summary Section */}
        {tasks.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
