import { Link } from "react-router-dom";
import { Theme } from "./Theme";
import { Language } from "./Language";
import { motion } from "framer-motion";
import { Blocks, Code2, LogOut, Sparkles } from "lucide-react";
import { RunButton } from "./RunButton";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";

export const Header = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Wait for Clerk auth to load before showing UI
  useEffect(() => {
    setAuthLoaded(true);
  }, []);

  // Function to handle token storage
  const handleAuthToken = useCallback(async () => {
    if (isSignedIn) {
      const token = await getToken();
      token
        ? localStorage.setItem("authToken", token)
        : localStorage.removeItem("authToken");
    } else {
      localStorage.removeItem("authToken");
    }
  }, [isSignedIn, getToken]);

  // Function to create/update user in DB
  const createUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        "https://saas-code-editor-backend-2.onrender.com/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkUserId: user.id, email, name }),
        }
      );

      if (!response.ok) {
        console.error("Failed to add user:", errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem("user_name", data.user.name);
      setIsPro(data.user.isPro); // ✅ Correct way to update state
    } catch (error) {
      console.error("Error in user creation request:", error);
    }
  }, [user, email, name]);

  useEffect(() => {
    handleAuthToken();
  }, [handleAuthToken]);

  useEffect(() => {
    createUser();
  }, [createUser]);

  return (
    <div className="sticky top-0 z-50 mb-6 p-3 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150 rounded-2xl px-6">
      <div className="absolute w-full inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="w-full  mx-auto">
        <div className="relative h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="w-6 h-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="relative">
                <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="block text-xs text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>
            <Link
              to="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Snippets
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Theme />
              <Language hasAccess={isPro} />
            </div>

            {/* work is remaing here */}
            {!isPro && (
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            )}

            <div className="pl-3 border-l border-gray-700">
              {!authLoaded ? null : (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
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
                </>
              )}
            </div>

            <SignedIn>
              <RunButton />
              <div className="pl-3 border-l border-gray-700">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
};
