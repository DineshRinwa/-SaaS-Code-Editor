import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun, Laptop, Cloud, Github } from "lucide-react";

const THEMES = [
  {
    id: "vs-dark",
    label: "Dark Mode",
    icon: <Moon className="size-4" />,
    color: "#1e1e2e",
  },
  {
    id: "vs-light",
    label: "Light Mode",
    icon: <Sun className="size-4" />,
    color: "#ffffff",
  },
  {
    id: "github-dark",
    label: "GitHub Dark",
    icon: <Github className="size-4" />,
    color: "#0d1117",
  },
  {
    id: "monokai",
    label: "Monokai",
    icon: <Laptop className="size-4" />,
    color: "#272822",
  },
  {
    id: "solarized-dark",
    label: "Solarized Dark",
    icon: <Cloud className="size-4" />,
    color: "#002b36",
  },
];

// create the  ThemeContext
const ThemeContext = createContext();

// Theme Provider to manage and distribute theme
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || THEMES[0].id;
  });

  // Store theme and apply it
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
