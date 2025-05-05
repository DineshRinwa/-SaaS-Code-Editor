import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ModernSignupButton = ({ onClick }) => {
  return (
    <motion.button
      className="relative overflow-hidden group px-5 sm:px-6 py-2 sm:py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500/30 cursor-pointer w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
      initial={{ boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" }}
      whileHover={{
        boxShadow: "0 0 20px 5px rgba(59, 130, 246, 0.3)",
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
        boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.5)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
      onClick={onClick}
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ x: "100%" }}
        whileHover={{ x: ["100%", "0%"] }}
        transition={{ duration: 0.4 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 pointer-events-none"
        initial={{ x: "-100%", skewX: "-20deg" }}
        whileHover={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
      />

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: [0, 15, -15, 0] }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
        <span className="whitespace-nowrap">Sign up</span>
      </div>

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg border-blue-400/50 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};
