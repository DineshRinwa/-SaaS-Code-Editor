import "./App.css";
import {Navbar} from "./Component/Navbar";
import { AllRoute } from "./Component/AllRoutes";
import { Home } from "./Pages/Home"

function App() {
  return (
    <div className="">
      <Navbar/>
      <AllRoute/>
    </div>
  );
}

export default App;
