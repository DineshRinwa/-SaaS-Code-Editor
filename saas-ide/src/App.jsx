import "./App.css";
import { AllRoute } from "./Component/AllRoutes";

function App() {
  return (
    <div>
      <p className="bg-gradient-to-r from-blue-300 to-purple-500 text-black font-bold text-md text-center tracking-wider py-2 rounded-lg shadow-md font-mono">
      If the server sleeps, refresh 2-3 times!
      </p>

      <AllRoute />
    </div>
  );
}

export default App;
