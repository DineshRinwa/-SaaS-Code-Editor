import { Link } from "react-router-dom";
import { Theme } from "./Theme";
import { Language } from "./Language";
import { Blocks, Code2 } from "lucide-react";
import { useState } from "react";
import { RunButton } from "./RunButton";
import { AuthCard } from "../../features/Auth/AuthCard";
import { ModernSignupButton } from "../../components/ModernSignupButton";
import { ProfileDropdown } from "../../features/Auth/ProfileDropdown";
import { useAuth } from "../../store/Auth/AuthContext";

export const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState("signup");

  const { user, isAuthenticated } = useAuth();

  const openAuthModal = (mode) => {
    setInitialAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-40 mb-6 p-3 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150 rounded-2xl px-6">
        <div className="absolute w-full inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="w-full mx-auto">
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
                <Language hasAccess={true} />
                <RunButton />
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                {isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <ModernSignupButton onClick={() => openAuthModal("signup")} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AuthCard will only open when explicitly triggered */}
      {!isAuthenticated && (
        <AuthCard
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          initialMode={initialAuthMode}
        />
      )}
    </>
  );
};