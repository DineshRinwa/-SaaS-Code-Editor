import { useState } from "react";
import { X } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { useCodeEditor } from "../Context/CodeEditorContext";
import { useUser } from "@clerk/clerk-react";

export const ShareSnippetDialog = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { language } = useCodeEditor();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null; // Prevent errors while Clerk is loading
  }

  const code = localStorage.getItem(`editor-code-${language}`) || ""; // Ensure code is never null
  const userId = user?.id;
  const userName = user?.fullName;


  const handleShare = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required", {
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
      return;
    }

    setIsSharing(true);

    try {
      const token = localStorage.getItem("authToken"); // Get JWT token from Clerk
      const response = await fetch(
        "https://saas-code-editor-backend-2.onrender.com/api/snippets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in request
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            userId,
            language,
            user: userName,
            code,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Fetch error message from response
        throw new Error(`Failed to create snippet: ${errorText}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await response.json();
      toast.success("Snippet shared successfully", {
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

      setTitle("");
      onClose();
    } catch (error) {
      console.error("Error sharing snippet:", error);

      toast.error("Error creating snippet", {
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
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            Share Snippet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleShare}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2 tracking-wider"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider"
              placeholder="Enter snippet title"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSharing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 cursor-pointer"
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
