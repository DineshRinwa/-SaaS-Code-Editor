import { Routes, Route } from "react-router-dom";
import { Home } from "../layouts/Home/Home";
import { SnippetsPage } from "../features/Home/SnippetsPage";
import { SnippetDetailPage } from "../components/Snippet/SnippetDetailPage";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/snippets" element={<SnippetsPage />} />
      <Route path="/snippets/single/:id" element={<SnippetDetailPage />} />
    </Routes>
  );
};
