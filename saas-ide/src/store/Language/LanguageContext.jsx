import { createContext, useContext, useEffect, useState } from "react";
import jsLogo from "../../assets/JavaScript.png";
import pythonLogo from "../../assets/python.png";
import javaLogo from "../../assets/java.png";
import cppLogo from "../../assets/cpp.png";
import csharpLogo from "../../assets/csharp.png";
import goLogo from "../../assets/go.png";
import rustLogo from "../../assets/rust.png";
import rubyLogo from "../../assets/ruby.png";
import tsLogo from "../../assets/ts.png";
import swiftLogo from "../../assets/swift.png";

// Configuration object for languages
export const LANGUAGE_CONFIG = {
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
  cpp: {
    id: "cpp",
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

// Create Context
const LanguageContext = createContext();

// Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("editor-language") || "javascript";
  });

  useEffect(() => {
    localStorage.setItem("editor-language", language);
  }, [language]);

  const handleSetLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        LANGUAGE_CONFIG,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook
export const useLanguage = () => useContext(LanguageContext);