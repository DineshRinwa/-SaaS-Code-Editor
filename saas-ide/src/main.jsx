import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { CodeEditorProvider } from "./Context/CodeEditorContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CodeEditorProvider>
      <App />
    </CodeEditorProvider>
  </BrowserRouter>
);
