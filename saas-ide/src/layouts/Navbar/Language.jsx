import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, Flag, Lock, Sparkles } from "lucide-react";
import { useLanguage } from "../../store/Language/LanguageContext";

export const Language = ({ hasAccess }) => {
  const { language, setLanguage, LANGUAGE_CONFIG } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  // Current Language
  const currentLanguage =
    LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    addEventListener("mousedown", handleClickOutside);

    return () => removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId) => {
    if (!hasAccess && langId !== "javascript") return;
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropDownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 rounded-lg border border-gray-800/50 hover:border-gray-700 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
          <img
            src={currentLanguage?.logoPath}
            alt={`${currentLanguage.label} logo`}
            width={24}
            height={24}
          />
        </div>
        <span className="text-gray-200 min-w-[80px] text-left group-hover:text-white transition-colors">
          {currentLanguage.label}
        </span>
        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2e]/95 backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">
                Select Language
              </p>
            </div>
            <div
              className="max-h-67 overflow-y-auto overflow-x-hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                const isLocked = !hasAccess && lang.id !== "javascript";
                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group px-2"
                  >
                    <button
                      className={`relative w-full flex items-center gap-3 hover:cursor-pointer px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        language === lang.id
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300"
                      } ${isLocked ? "opacity-50" : "hover:bg-[#262637]"}`}
                      onClick={() => handleLanguageSelect(lang.id)}
                      disabled={isLocked}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div
                        className={`relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform ${
                          language === lang.id
                            ? "bg-blue-500/10"
                            : "bg-gray-800/50"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                          width={24}
                          height={24}
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          className="w-full h-full object-contain relative z-10"
                        />
                      </div>
                      <span className="flex-1 text-left group-hover:text-white transition-colors">
                        {lang.label}
                      </span>
                      {language === lang.id && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-gray-500" />
                      ) : (
                        language === lang.id && (
                          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                        )
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
