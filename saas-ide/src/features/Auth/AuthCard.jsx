import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Login } from "./Login";
import { Signup } from "./Sign";

export const AuthCard = ({ isOpen, onClose, initialMode = "signup" }) => {
  const [mode, setMode] = useState(initialMode);

  // Update mode when initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: {
      y: "-50vh",
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    exit: {
      y: "50vh",
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4"
          variants={cardVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <Login
                  key="login"
                  switchMode={() => setMode("signup")}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              ) : (
                <Signup
                  key="signup"
                  switchMode={() => setMode("login")}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
