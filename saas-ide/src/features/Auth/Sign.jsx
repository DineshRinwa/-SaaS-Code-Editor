import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Circle } from "lucide-react";
import { useAuth } from "../../store/Auth/AuthContext"; // Make sure to update this path

export const Signup = ({ switchMode, onClose }) => {
  const { signup, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear auth context errors when component mounts or unmounts
  React.useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Update local errors if authError changes
  React.useEffect(() => {
    if (authError) {
      setErrors(prev => ({ ...prev, general: authError }));
    }
  }, [authError]);

  // Form validation
  const validateField = (name, value, allValues = formData) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
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
        } else if (!/(?=.*[0-9])/.test(value)) {
          error = "Password must contain at least one number";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== allValues.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // For confirmPassword, we need to validate against the current password
    const error = validateField(name, value, updatedFormData);
    setErrors({ ...errors, [name]: error });

    // If we're changing the password, also validate confirmPassword
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword,
        updatedFormData
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let newErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value, formData);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);

      try {
        // Use the AuthContext's signup method instead of direct fetch
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        
        // If successful, close the modal
        onClose();
      } catch (error) {
        console.error("Signup failed", error);
        setErrors({
          ...newErrors,
          general: error.message || "Signup failed. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
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

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthText = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
      strength
    ];

    const strengthColor = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ][strength];

    return {
      strength: strength * 20,
      text: strengthText,
      color: strengthColor,
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
          Create Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Join us today</p>
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
            htmlFor="name"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <User className="w-3 h-3 sm:w-5 sm:h-5" />
            </span>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.name
                  ? "border-red-500 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 tracking-wider text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="Dinesh Rinwa"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.name}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 tracking-wider"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
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
              } tracking-wider bg-white dark:bg-gray-700  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="dineshri@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
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

          {formData.password && (
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden tracking-wider">
                <div
                  className={`h-full ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 tracking-wider">
                {passwordStrength.text}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 tracking-wider"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              } tracking-wider bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="• • • • • • • •"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full py-2 px-4 rounded-lg font-medium text-white 
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:brightness-110 hover:shadow-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      transition-all duration-300 ease-in-out
      ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
    `}
          >
            {/* Shine layer on hover */}
            <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

            {/* Button content */}
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="relative z-10">Create Account</span>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="text-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none cursor-pointer"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};