import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";


export const SignedOutButton = () => {
  return (
    <SignedOut>
      <div className="pl-3 border-l border-gray-800" />
      <SignInButton mode="modal">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button" // Added for accessibility
          className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 focus:outline-none cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-900 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />
          <div className="relative flex items-center gap-2.5">
            <LogOut className="w-6 h-6 text-white font-bold" />
            <span className="text-md font-medium text-white/90 group-hover:text-white tracking-wide">
              Sign In
            </span>
          </div>
        </motion.button>
      </SignInButton>
    </SignedOut>
  );
};