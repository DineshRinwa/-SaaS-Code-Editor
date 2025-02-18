import { OutputPanel } from "../Component/HomeComponent/OutputPanel";
import { EditorPanel } from "../Component/HomeComponent/Editorpanel";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
};
