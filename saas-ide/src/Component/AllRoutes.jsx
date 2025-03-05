import { Routes, Route } from "react-router";
import { Home } from "../Pages/Home";
import { SnippetsPage } from "./SnippetComponent/SnippetPage";
import { ProPlan } from "../Pages/ProPlan";
import { SnippetDetailPage } from "./SnippetComponent/SnippetDetailPage";

export const AllRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/snippets" element={<SnippetsPage />} />
      <Route path="/pricing" element={<ProPlan />} />
      <Route path="/snippets/single/:id" element={<SnippetDetailPage/>} />
    </Routes>
  );
};