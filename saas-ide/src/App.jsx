import "./App.css";
import { AllRoute } from "./Component/AllRoutes";

function App() {
  return (
    <div>
      <p className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold font-sans text-md text-center tracking-wider py-2 rounded-lg shadow-md">
        For the best experience, please use this app in the Chrome browser!
        (Clerk)
      </p>

      <AllRoute />
    </div>
  );
}

export default App;
