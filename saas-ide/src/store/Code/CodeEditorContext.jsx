import { createContext, useContext, useEffect, useState, version } from "react";
import { useLanguage } from "../Language/LanguageContext";
import { LANGUAGE_CONFIG } from "../Language/LanguageContext";

// Create the context
const CodeEditorContext = createContext();

// Provider component
export const CodeEditorProvider = ({ children }) => {
  const { language } = useLanguage();
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("editor-font-size")) || 16;
  });

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  // Save font size
  useEffect(() => {
    localStorage.setItem("editor-font-size", fontSize.toString());
  }, [fontSize]);

  // Get the code from editor instance
  const getCode = () => editor?.getValue() || "";

  const handleSetEditor = (editorInstance) => {
    setEditor(editorInstance);
  };

  // Run code using Piston API
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
      let runtime = LANGUAGE_CONFIG[language].pistonRuntime;
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language : runtime.language,
          version : runtime.version,
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
        const compileError = data.compile.stderr || data.compile.output;
        setError(compileError);
        setExecutionResult({ code, output: "", error: compileError });
        return;
      }

      if (data.run && data.run.code !== 0) {
        const runError = data.run.stderr || data.run.output;
        setError(runError);
        setExecutionResult({ code, output: "", error: runError });
        return;
      }

      const output = data.run.output;
      setOutput(output.trim());
      setExecutionResult({ code, output: output.trim(), error: null });
    } catch (err) {
      setError("Error running code");
      setExecutionResult({
        code: getCode(),
        output: "",
        error: "Error running code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <CodeEditorContext.Provider
      value={{
        fontSize,
        setFontSize,
        output,
        isRunning,
        error,
        editor,
        setEditor: handleSetEditor,
        executionResult,
        runCode,
        getCode,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

// Custom hook
export const useCodeEditor = () => useContext(CodeEditorContext);
