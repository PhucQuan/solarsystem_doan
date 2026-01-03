import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import Toast from "./components/Toast";
import Navbar from "./components/navigation_bar";
import ChatBot from "./ChatBot";
import { AppProvider } from "./contexts/AppContext";

// Lazy load all pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Planets = lazy(() => import("./pages/Planets"));
const PlanetDetail = lazy(() => import("./pages/PlanetDetails"));
const Explore3D = lazy(() => import("./pages/Explore3D"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Learn = lazy(() => import("./pages/Learn"));

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="app-root">
            <Navbar />
            <main>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/planets" element={<Planets />} />
                  <Route path="/planets/:id" element={<PlanetDetail />} />
                  <Route path="/explore3d" element={<Explore3D />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/about" element={<About />} />
                  {/* Redirect old routes to new unified Learn page */}
                  <Route path="/articles" element={<Navigate to="/learn" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Toast />
            <ChatBot />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
