// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Initialize i18n
import App from "./app/core/App";

createRoot(document.getElementById("root")).render(
    <App /> 
);