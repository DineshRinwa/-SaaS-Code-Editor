import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun, Laptop, Cloud, Github } from "lucide-react";

// Import images manually (Recommended)
import jsLogo from "../assets/javascript.png";
import pythonLogo from "../assets/python.png";
import javaLogo from "../assets/java.png";
import cppLogo from "../assets/cpp.png";
import csharpLogo from "../assets/csharp.png";
import goLogo from "../assets/go.png";
import rustLogo from "../assets/rust.png";
import rubyLogo from "../assets/ruby.png";
import tsLogo from "../assets/ts.png";
import swiftLogo from "../assets/swift.png";

const LANGUAGE_CONFIG = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    logoPath: jsLogo,
    pistonRuntime: { language: "javascript", version: "18.15.0" },
  },
  python: {
    id: "python",
    label: "Python",
    logoPath: pythonLogo,
    pistonRuntime: { language: "python", version: "3.10.0" },
  },
  java: {
    id: "java",
    label: "Java",
    logoPath: javaLogo,
    pistonRuntime: { language: "java", version: "15.0.2" },
  },
  cplusplus: {
    id: "cplusplus",
    label: "C++",
    logoPath: cppLogo,
    pistonRuntime: { language: "cpp", version: "10.2.0" },
  },
  csharp: {
    id: "csharp",
    label: "C#",
    logoPath: csharpLogo,
    pistonRuntime: { language: "csharp", version: "6.12.0" },
  },
  go: {
    id: "go",
    label: "Go",
    logoPath: goLogo,
    pistonRuntime: { language: "go", version: "1.18.0" },
  },
  rust: {
    id: "rust",
    label: "Rust",
    logoPath: rustLogo,
    pistonRuntime: { language: "rust", version: "1.58.0" },
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    logoPath: rubyLogo,
    pistonRuntime: { language: "ruby", version: "3.0.1" },
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: tsLogo,
    pistonRuntime: { language: "typescript", version: "4.2.3" },
  },
  swift: {
    id: "swift",
    label: "Swift",
    logoPath: swiftLogo,
    pistonRuntime: { language: "swift", version: "5.3.3" },
  },
};

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

// Create the CodeEditorContext
const CodeEditorContext = createContext();

// CodeEditor Provider to manage and distribute state
export const CodeEditorProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("editor-language") || "javascript";
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("editor-theme") || "vs-dark";
  });
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("editor-font-size")) || 16;
  });
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  useEffect(() => {
    localStorage.setItem("editor-language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("editor-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("editor-font-size", fontSize.toString());
  }, [fontSize]);

  const getCode = () => editor?.getValue() || "";

  const handleSetEditor = (editorInstance) => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    if (savedCode) editorInstance.setValue(savedCode);
    setEditor(editorInstance);
  };

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSetFontSize = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const handleSetLanguage = (newLanguage) => {
    const currentCode = getCode();
    if (currentCode) {
      localStorage.setItem(`editor-code-${language}`, currentCode);
    }
    setLanguage(newLanguage);
    setOutput("");
    setError(null);
  };

  const runCode = async () => {
    const code = getCode();

    if (!code) {
      setError("Please enter some code");
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      if (data.message) {
        setError(data.message);
        setExecutionResult({ code, output: "", error: data.message });
        return;
      }

      if (data.compile && data.compile.code !== 0) {
        const error = data.compile.stderr || data.compile.output;
        setError(error);
        setExecutionResult({ code, output: "", error });
        return;
      }

      if (data.run && data.run.code !== 0) {
        const error = data.run.stderr || data.run.output;
        setError(error);
        setExecutionResult({ code, output: "", error });
        return;
      }

      const output = data.run.output;
      setOutput(output.trim());
      setError(null);
      setExecutionResult({ code, output: output.trim(), error: null });

    } catch (error) {
      setError("Error running code");
      setExecutionResult({ code, output: "", error: "Error running code" });

    } finally {
      setIsRunning(false);
    }
  };

  return (
    <CodeEditorContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        theme,
        setTheme: handleSetTheme,
        fontSize,
        setFontSize: handleSetFontSize,
        output,
        isRunning,
        error,
        editor,
        setEditor: handleSetEditor,
        executionResult,
        runCode,
        LANGUAGE_CONFIG,
        THEMES,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

// Custom hook to use CodeEditorContext
export const useCodeEditor = () => useContext(CodeEditorContext);