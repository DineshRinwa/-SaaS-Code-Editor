import { useRef, useState, useEffect } from "react";
import { EditorPanel } from "../features/codeEditor/CodeInput";
import { OutputPanel } from "../features/codeEditor/CodeOutput";

export const ResizableEditorLayout = () => {
  const containerRef = useRef(null);
  const dividerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(66);
  const [isFullSize, setIsFullSize] = useState(false);

  // Store initial position on drag start
  const startDragging = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", stopDragging);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // Handle smooth dragging
  const handleDragging = (e) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerWidth) * 100;

    // Apply constraints (30% to 70%)
    const constrainedWidth = Math.max(30, Math.min(70, newLeftWidth));
    setLeftWidth(constrainedWidth);
  };

  // Clean up dragging
  const stopDragging = () => {
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", stopDragging);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // Toggle fullscreen mode
  const toggleSize = () => {
    setIsFullSize(!isFullSize);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      stopDragging();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex w-full relative ${
        isFullSize ? "h-[1100px] flex-col mb-9" : "h-[600px]"
      }`}
    >
      {/* Editor Panel */}
      <div
        style={{ width: isFullSize ? "100%" : `${leftWidth}%` }}
        className={`h-full transition-all duration-200 ease-out ${
          isFullSize ? "" : "min-w-[45%]"
        }`}
      >
        <EditorPanel isFullSize={isFullSize} toggleSize={toggleSize} />
      </div>

      {/* Divider - only in split view */}
      {!isFullSize && (
        <div
          ref={dividerRef}
          onMouseDown={startDragging}
          className="w-1 cursor-col-resize bg-gray-300 hover:bg-blue-500 active:bg-blue-600 
                   transition-colors z-10"
        />
      )}

      {/* Output Panel */}
      <div
        style={!isFullSize ? { width: `${100 - leftWidth}%` } : {}}
        className={`${
          isFullSize
            ? "w-full h-[500px] mt-5 border-gray-200"
            : "h-full min-w-[30%]"
        }  transition-all duration-200 ease-out`}
      >
        <OutputPanel isFullSize={isFullSize} />
      </div>
    </div>
  );
};
