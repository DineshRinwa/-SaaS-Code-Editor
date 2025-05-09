import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { useCodeEditor } from "../../store/Code/CodeEditorContext";

export const RunButton = () => {
  const { runCode, isRunning } = useCodeEditor();

  const handleRun = async () => {
    await runCode();
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center justify-center gap-2.5 px-5 py-2.5
        w-full sm:w-auto max-w-full
        text-xs sm:text-sm md:text-base
        rounded-xl font-medium
        disabled:cursor-not-allowed
        focus:outline-none
        cursor-pointer
      `}
    >
      {/* bg with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-[0.75rem] sm:text-sm font-medium text-white/90">
              Executing...
            </span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-[0.75rem] sm:text-sm font-medium text-white/90 group-hover:text-white">
              Run Code
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
};
