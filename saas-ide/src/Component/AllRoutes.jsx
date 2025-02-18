import { Routes, Route } from "react-router";
import { Home } from "../Pages/Home";
import { Snippet } from "./Snippet";
import { PricePlan } from "./PricingPlan";

export const AllRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/snippets" element={<Snippet />} />
      <Route path="/pricing" element={<PricePlan />} />
    </Routes>
  );
};
