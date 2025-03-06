import "./App.css";
import { AllRoute } from "./Component/AllRoutes";

function App() {
  return (
    <div>
      <div className="bg-amber-500 text-black text-md text-center tracking-wides">If the Sign In button is not visible, refresh the app. This may also affect snippet sharing due to Clerk !</div>
      <AllRoute/>
    </div>
  );
}

export default App;