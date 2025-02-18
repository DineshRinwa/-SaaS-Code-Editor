import React, { useState, useEffect, useRef } from "react";
import profile from "../../assets/go.png";
import { RunButton } from "../RunButton";
import { motion } from "framer-motion";
//import { ArrowRightFromBracket } from "lucide-react";
import { LogOut } from "lucide-react";
import { span } from "framer-motion/client";

export const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dropdownRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Handle Sign-In (Show Popup)
  const handleSignIn = () => {
    setShowToast(true);
  };

  // Handle Login
  const handleLogin = () => {
    localStorage.setItem("authToken", "dummyToken");
    setIsAuthenticated(true);
    setShowToast(false);
  };

  // Handle Sign-Up
  const handleSignUp = () => {
    localStorage.setItem("authToken", "dummyToken");
    setIsAuthenticated(true);
    setShowToast(false);
  };

  // Handle Sign-Out
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowToast(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex">
      {isAuthenticated ? (
        <>
          <RunButton />
          <div className="flex items-center ml-4">
            <div className="pl-3 border-l border-gray-800">
              <img
                src={profile}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={handleSignOut}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="pl-3 border-l border-gray-800">
          <motion.button
            onClick={handleSignIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        group relative inline-flex items-center gap-2.5 px-5 py-2.5
        disabled:cursor-not-allowed
        focus:outline-none
      `}
          >
            {/* bg wit gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-900 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

            <div className="relative flex items-center gap-2.5 cursor-pointer">
              <div className="relative flex items-center justify-center w-4 h-4">
                <LogOut className="w-6 h-6 text-white font-bold" />
              </div>
              <span className="text-md font-medium text-white/90 group-hover:text-white cursor-pointer tracking-wide">
                Sign In
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Auth Popup */}
      {showToast && (
        <div
          ref={dropdownRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-blue-900 p-10 rounded-lg w-100 z-1000 mt-[20%] shadow-[0px_1px_2px_rgba(255,215,0,0.07),0px_2px_4px_rgba(255,215,0,0.07),0px_4px_8px_rgba(255,215,0,0.07),0px_8px_16px_rgba(255,215,0,0.07),0px_16px_32px_rgba(255,215,0,0.07),0px_32px_64px_rgba(255,215,0,0.07)]"
        >
          <h3 className="text-3xl font-semibold mb-8 text-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              isLoginForm ? handleLogin() : handleSignUp();
            }}
          >
            {!isLoginForm && (
              <input
                type="text"
                placeholder="User name"
                required
                className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-0 tracking-widest"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500  outline-0 tracking-widest"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500  outline-0 tracking-widest"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer tracking-widest my-4"
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </form>

          <button
            onClick={() => setIsLoginForm(!isLoginForm)}
            className="w-full mt-2  hover:underline cursor-pointer tracking-wider"
          >
            {isLoginForm
              ? `Create an account. Sign In`
              : "Already have an account ? Login"}
          </button>
        </div>
      )}
    </div>
  );
};
