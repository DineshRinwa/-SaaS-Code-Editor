import "./App.css";
import { AllRoute } from "./Component/AllRoutes";

function App() {
  return (
    <div>
      <div className="bg-amber-500 text-md text-center tracking-wide">Make sure to refresh the app when sharing snippets due to Clerk.!</div>
      <AllRoute/>
    </div>
  );
}

export default App;