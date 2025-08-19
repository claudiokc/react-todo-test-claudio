import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// FIXED: Corrected import path to match actual file extension
import { ClunkyTodoList } from "./ClunkyTodoList.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClunkyTodoList />
  </StrictMode>
);
