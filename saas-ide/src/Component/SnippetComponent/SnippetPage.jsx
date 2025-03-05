import { useEffect, useState } from "react";
import { SnippetsPageSkeleton } from "./SnippetsPageSkeleton";
import { NavigationHeader } from "../Providers/NavigationHeader";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Code, Grid, Layers, Search, Tag, X } from "lucide-react";
import { SnippetCard } from "./SnippetCard";
import { toast, Bounce } from "react-toastify/unstyled";
import { LANGUAGE_CONFIG } from "../HomeComponent/Constants";

export const SnippetsPage = () => {
  const [snippets, setSnippets] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [view, setView] = useState("grid");

  // Get All Snippets
  useEffect(() => {
    const getSnippets = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get JWT token from Clerk
        const response = await fetch(
          "https://saas-code-editor-backend-2.onrender.com/api/snippets",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in request
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text(); // Fetch error message from response
          throw new Error(`Failed to Get snippets: ${errorText}`);
        }

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON");
        }

        const data = await response.json();
        setSnippets(data.data);
      } catch (error) {
        console.error("Error sharing snippet:", error);

        toast.error("Error Getting snippet", {
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
      } 
    };

    getSnippets();
  }, []);

  if (snippets === undefined) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    );
  }

  const languages = [...new Set(snippets?.map((s) => s.language))];
  const popularLanguages = languages?.slice(0, 5);

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto px-4 py-12 tracking-wider">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" /> Community Code Library
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            Discover & Share Code Snippets
          </motion.h1>
          <motion.p className="text-lg text-gray-400">
            Explore a curated collection of code snippets from the community.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets by title, language or author..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 tracking-wider"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Languages:</span>
            </div>

            {popularLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() =>
                  setSelectedLanguage(lang === selectedLanguage ? null : lang)
                }
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      selectedLanguage === lang
                        ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                        : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                    }
                  `}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                     src={LANGUAGE_CONFIG[lang].logoPath}
                    alt={lang}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm">{lang}</span>
                </div>
              </button>
            ))}

            {selectedLanguage && (
              <button
                onClick={() => setSelectedLanguage(null)}
                className="text-gray-400 hover:text-gray-300 border-1 flex items-center gap-1 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {filteredSnippets.length} snippets found
              </span>
              <div className="flex items-center gap-1 p-1 bg-gray-800 rounded-lg">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 cursor-pointer rounded-md ${
                    view === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md cursor-pointer ${
                    view === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <motion.div
          className={`grid gap-6 ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-20 p-8 rounded-2xl text-center border-2"
          >
            <Code className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white">
              No snippets found
            </h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage(null);
              }}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border-2"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};