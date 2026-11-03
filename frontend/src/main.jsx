import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";

import App from "./App.jsx";
import "./index.css";
import "./styles/themes.css";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HeroUIProvider>
  </StrictMode>
);
