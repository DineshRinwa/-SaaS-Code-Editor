import { useEffect, useState } from "react";
import { Type, RotateCcw, Share, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { Bounce, toast } from "react-toastify";

// Custom hooks and utilities
import { useCodeEditor } from "../../store/Code/CodeEditorContext";
import { useTheme } from "../../store/Theme/ThemeContext";
import { useLanguage } from "../../store/Language/LanguageContext";
import { LANGUAGE_CONFIG, defineMonacoThemes } from "../../services/index";
import { ShareSnippetDialog } from "../../components/ShareSnippetDialog";

export const EditorPanel = ({ isFullSize, toggleSize }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const { theme } = useTheme();
  const { language } = useLanguage();
  const { fontSize, editor, setFontSize, setEditor } = useCodeEditor();

  // Check user authentication status and update userData
  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedData = JSON.parse(authData);
        setUserData(parsedData);
        setIsAuthenticated(true);
        return { isAuthenticated: true, userData: parsedData };
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        return { isAuthenticated: false, userData: null };
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      setIsAuthenticated(false);
      setUserData(null);
      return { isAuthenticated: false, userData: null };
    }
  };

  // Check auth once when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load code from localStorage or fallback to default language config
  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  // Restore editor to default state and clear local storage
  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  // Persist code changes to localStorage
  const handleEditorChange = (value) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  // Adjust font size within allowed range and persist setting
  const handleFontSizeChange = (newSize) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  // Open share dialog if authenticated; otherwise, show warning
  const handleShareBtnClick = () => {
    // Always check auth status right before sharing to ensure we have latest data
    const { isAuthenticated, userData: freshUserData } = checkAuthStatus();
    
    if (isAuthenticated && freshUserData) {
      setIsShareDialogOpen(true);
    } else {
      showAuthWarning();
    }
  };

  // Toast notification for unauthenticated share attempt
  const showAuthWarning = () => {
    toast.warn("Sign in now and share snippets!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  // Monaco Editor configuration settings
  const editorOptions = {
    minimap: { enabled: false },
    fontSize,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    renderWhitespace: "selection",
    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    fontLigatures: true,
    cursorBlinking: "smooth",
    smoothScrolling: true,
    contextmenu: true,
    renderLineHighlight: "all",
    lineHeight: 1.6,
    letterSpacing: 0.5,
    roundedSelection: true,
    wordWrap: "off",
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      alwaysConsumeMouseWheel: false,
    },
  };

  return (
    <div className="relative">
      {/* Main Editor Container */}
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header section with controls */}
        <div className="flex items-center justify-between mb-4">
          {/* Editor identity and language icon */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <img
                src={LANGUAGE_CONFIG[language].logoPath}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>

          {/* Font size, layout toggle, reset, and share controls */}
          <div className="flex items-center gap-3">
            {/* Font size control */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <Type className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            {/* Toggle editor fullscreen */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSize}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors cursor-pointer"
              aria-label={isFullSize ? "Minimize editor" : "Maximize editor"}
            >
              {isFullSize ? (
                <Minimize2 className="size-4 text-gray-400" />
              ) : (
                <Maximize2 className="size-4 text-gray-400" />
              )}
            </motion.button>

            {/* Reset editor to default code */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors cursor-pointer"
              aria-label="Reset to default code"
            >
              <RotateCcw className="size-4 text-gray-400" />
            </motion.button>

            {/* Share code snippet */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareBtnClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Share className="size-4 text-white" />
              <span className="text-sm font-medium text-white">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Monaco Editor instance */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05] max-h-150">
          <Editor
            height="500px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            defaultValue={LANGUAGE_CONFIG[language].defaultCode}
            onChange={handleEditorChange}
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={(editorInstance) => {
              setEditor(editorInstance);
              const savedCode = localStorage.getItem(
                `editor-code-${language}`
              );
              if (savedCode) {
                editorInstance.setValue(savedCode);
              }
            }}
            options={editorOptions}
          />
        </div>

        {/* Share dialog modal */}
        {isShareDialogOpen && (
          <ShareSnippetDialog
            isOpen={isShareDialogOpen}
            onClose={() => setIsShareDialogOpen(false)}
            code={editor?.getValue() || ""}
            language={language}
            user={userData}
          />
        )}
      </div>
    </div>
  );
};