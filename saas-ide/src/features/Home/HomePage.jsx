import { Navbar } from "../../layouts/Navbar/Navbar";
import { ResizableEditorLayout } from "../../components/ResizableEditorLayout";

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <ResizableEditorLayout />
      </div>
    </div>
  );
};
