import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Circle } from "lucide-react";
import { useAuth } from "../../store/Auth/AuthContext"; // Import useAuth hook

export const Login = ({ switchMode, onClose }) => {
  const { login, error: authError, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Clear form errors when auth error changes
  useEffect(() => {
    if (authError) {
      setErrors((prev) => ({ ...prev, general: authError }));
    }
  }, [authError]);

  // Form validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when typing
    if (authError) clearError();
    setErrors({ ...errors, [name]: "", general: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      email: "",
      password: "",
      general: "",
    });

    // Validate all fields
    let newErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (isValid) {
      try {
        await login(formData);
        // Success - the component will be unmounted when onClose is called
        // but let's be safe and check if the component is still mounted
        onClose();
      } catch (error) {
        // Error is already handled by AuthContext, but we can display specific messages here
        console.error("Login attempt failed");
        // No need to set error state here as it will come from authError
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex flex-col"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Welcome Back
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Sign in to your account
        </p>
      </motion.div>

      {errors.general && (
        <motion.div
          variants={itemVariants}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center"
        >
          {errors.general}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <motion.div variants={itemVariants} className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 tracking-wider"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 tracking-wider">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.email
                  ? "border-red-500 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1 tracking-wider">
              {errors.email}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 tracking-wider"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.password
                  ? "border-red-500 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              } tracking-wider bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="• • • • • • • •"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1 tracking-wider">
              {errors.password}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center text-sm mb-6"
        >
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <div>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          className={`
            relative w-full py-2.5 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer
            shadow-md hover:shadow-xl
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            flex justify-center items-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2">
            {isLoading && (
              <Circle className="w-4 h-4 animate-spin text-white/90" />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </span>
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={switchMode}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};
