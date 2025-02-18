import { createContext, useContext, useEffect, useState } from "react";

// ✅ Import images manually (Recommended)
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
  },
  python: { id: "python", label: "Python", logoPath: pythonLogo },
  java: { id: "java", label: "Java", logoPath: javaLogo },
  cplusplus: { id: "cplusplus", label: "C++", logoPath: cppLogo },
  csharp: { id: "csharp", label: "C#", logoPath: csharpLogo },
  go: { id: "go", label: "Go", logoPath: goLogo },
  rust: { id: "rust", label: "Rust", logoPath: rustLogo },
  ruby: { id: "ruby", label: "Ruby", logoPath: rubyLogo },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: tsLogo,
  },
  swift: { id: "swift", label: "Swift", logoPath: swiftLogo },
};

// Create the LanguageContext
const LanguageContext = createContext();

// Language Provider to manage and distribute theme
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "javascript";
  });

  // Store theme and apply it
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const currentLanguageObj =
    LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguage: currentLanguageObj,
        LANGUAGE_CONFIG,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// custom hook to use Language
export const useLanguage = () => useContext(LanguageContext);
