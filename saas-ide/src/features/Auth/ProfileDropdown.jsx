import { useState, useRef, useEffect } from "react";
import { LogOut, ShoppingBag, Heart } from "lucide-react";
import { useAuth } from "../../store/Auth/AuthContext";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <span
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-lg shadow-md ring-2 ring-white/20 hover:scale-105 hover:shadow-lg transition-transform duration-200 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.name ? user.name[0]?.toUpperCase() : "U"}
      </span>

      {/* Dropdown Card with Animation */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden origin-top-right transition-transform transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }  bg-gray-900`}
        >
          <div className="py-2 rounded-lg shadow-xl border-2 border-gray-800">
            {/* User Info Section */}
            <div className="px-4 py-3 border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
                  {user?.name ? user.name[0]?.toUpperCase() : "U"}
                </div>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="pl-5 pr-5">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex items-center gap-3 rounded-lg font-medium transition-all duration-200 shadow-md cursor-pointer bg-red-600 text-white hover:bg-red-500 hover:shadow-lg"
              >
                <LogOut
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
