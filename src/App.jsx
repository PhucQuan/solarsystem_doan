import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Planets from "./pages/Planets";
import PlanetDetail from "./pages/PlanetDetails";
import Explore3D from "./pages/Explore3D";
import Navbar from "./components/navigation_bar";


function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/planets/:id" element={<PlanetDetail />} />
            <Route path="/explore3d" element={<Explore3D />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
