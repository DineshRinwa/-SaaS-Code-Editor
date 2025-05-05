import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, Code, MessageSquare, User, Copy, Check } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { SnippetNavbar } from "./SnippetNavbar";
import { SnippetLoadingSkeleton } from "./SnippetLoadingSkeleton";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../../services/index";

export const SnippetDetailPage = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(
          `https://saas-code-editor-backend-2.onrender.com/api/snippets/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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

        let data = await response.json();
        setSnippet(data.data);

      } catch (error) {
        console.error("Failed to fetch snippet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  if (isLoading || !snippet) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SnippetNavbar />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#ffffff08] p-2.5">
                  <img
                    src={LANGUAGE_CONFIG[snippet.language].logoPath}
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {snippet.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#8b8b8d]">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{snippet.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(snippet.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
                {snippet.language}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <button
                onClick={copyToClipboard}
                type="button"
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative cursor-pointer"
              >
                {copied ? (
                  <Check className="size-4 text-green-400" />
                ) : (
                  <Copy className=" size-4 text-gray-400 group-hover:text-gray-300" />
                )}
              </button>
            </div>
            <Editor
              height="600px"
              language={
                LANGUAGE_CONFIG[snippet.language]?.monacoLanguage ||
                "javascript"
              }
              value={snippet.code}
              theme="vs-dark"
              beforeMount={defineMonacoThemes}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                readOnly: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};