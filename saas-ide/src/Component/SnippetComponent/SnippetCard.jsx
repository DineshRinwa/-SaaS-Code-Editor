import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Trash2, User } from "lucide-react";
// import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LANGUAGE_CONFIG } from "../HomeComponent/Constants";
import { toast, Bounce } from "react-toastify";

export const SnippetCard = ({ snippet, setSnippets }) => {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (snippet_id) => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://saas-code-editor-backend-2.onrender.com/api/snippets/${snippet_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete snippet: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await response.json();
      console.log(data)
      toast.success("Snippet Deleted successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      // ✅ Remove deleted snippet from UI
      setSnippets((prevSnippets) => prevSnippets.filter((s) => s._id !== snippet_id));
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Error deleting snippet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      className="group relative"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/snippets/single/${snippet._id}`} className="h-full block">
        <div
          className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
          border border-[#313244]/50 hover:border-[#313244] 
          transition-all duration-300 overflow-hidden tracking-wider"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                  group-hover:opacity-30 transition-all duration-500"
                    aria-hidden="true"
                  />
                  <div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20
                   group-hover:to-purple-500/20 transition-all duration-500"
                  >
                    <img
                      src={LANGUAGE_CONFIG[snippet.language].logoPath}
                      alt={`${snippet.language} logo`}
                      className="w-6 h-6 object-contain relative z-10"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-2 my-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(snippet.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              <div
                className="absolute top-5 right-5 z-10 flex gap-4 items-center"
                onClick={(e) => e.preventDefault()}
              >
                {user?.id === snippet.userId && (
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={() => handleDelete(snippet._id)}
                      disabled={isDeleting}
                      className={`group flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                                  ${
                                    isDeleting
                                      ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                                      : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                  }
                                `}
                    >
                      {isDeleting ? (
                        <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gray-800/50">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="truncate max-w-[150px]">
                      {snippet.user}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative group/code">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                <pre className="relative bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-3">
                  {snippet.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};