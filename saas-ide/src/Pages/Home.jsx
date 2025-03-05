import { OutputPanel } from "../Component/HomeComponent/OutputPanel";
import { EditorPanel } from "../Component/HomeComponent/Editorpanel";
import { Header } from "../Component/Header";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-2">
        <Header/>
        <div className="grid grid-cols-1 lg:grid-cols-[65.66%_33.33%] gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
};
