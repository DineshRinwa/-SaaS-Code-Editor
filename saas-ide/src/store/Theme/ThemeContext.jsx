import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun, Laptop, Cloud } from "lucide-react";

export const THEMES = [
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
    icon: <Moon className="size-4" />,
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

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("editor-theme") || "vs-dark";
  });

  useEffect(() => {
    localStorage.setItem("editor-theme", theme);
  }, [theme]);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);