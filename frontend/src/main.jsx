import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import App from "./App.jsx";
import "./index.css";
import "./styles/themes.css";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HeroUIProvider>
  </React.StrictMode>
);
