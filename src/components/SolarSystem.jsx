import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import * as TWEEN from '@tweenjs/tween.js';
import Planet from "./Planet";
import CameraController from "./CameraController";
import { PLANET_DATA } from "../data/solarSystemData";
import TimeControl from "./TimeControl";
import OrbitalPath from "./OrbitalPath";
import ViewModeControl from "./ViewModeControl";
import EnhancedPlanetPanel from "./EnhancedPlanetPanel";
import PlanetSearch from "./PlanetSearch";
import StarField from "./StarField";
import EnhancedSun from "./EnhancedSun";
import { TourManager } from "../features/tours";
import cameraController from "../features/tours/utils/cameraController";

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#444444" wireframe />
    </mesh>
  );
}

// Helper component to capture camera ref
function CameraRefCapture({ cameraRef }) {
  useFrame(({ camera }) => {
    if (cameraRef && !cameraRef.current) {
      cameraRef.current = camera;
    }
  });
  return null;
}

// Helper component to update TWEEN animations
function TweenUpdater() {
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    frameCount.current++;
    const currentTime = state.clock.getElapsedTime() * 1000;

    if (frameCount.current % 60 === 0) {
      console.log('🕐 TweenUpdater running, global tweens:', TWEEN.getAll().length);
    }

    // Update global TWEEN (for other animations if any)
    TWEEN.update(currentTime);

    // Update camera controller's custom Group
    cameraController.update(currentTime);
  });
  return null;
}

// Camera controller for view modes
function ViewModeCamera({ viewMode, targetPlanet }) {
  const cameraRef = useRef();

  useFrame(({ camera }) => {
    if (viewMode === 'heliocentric') {
      // View from Sun's perspective
      const target = { x: 0, y: 20, z: 50 };
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'geocentric' && targetPlanet) {
      // View from Earth's perspective  
      const earthPos = targetPlanet.position;
      camera.position.lerp({
        x: earthPos.x + 10,
        y: earthPos.y + 5,
        z: earthPos.z + 10
      }, 0.05);
      camera.lookAt(earthPos.x, earthPos.y, earthPos.z);
    }
    // 'free' mode uses OrbitControls by default
  });

  return null;
}

export default function SolarSystem() {
  const [focusedPlanet, setFocusedPlanet] = useState(null);
  const [planetData, setPlanetData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Time control states
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(10);
  const [simulationTime, setSimulationTime] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // View mode states
  const [viewMode, setViewMode] = useState('free'); // 'heliocentric', 'geocentric', 'free'
  const [showOrbits, setShowOrbits] = useState(true);

  // Tour state
  const [tourState, setTourState] = useState({
    isActive: false,
    isPaused: false,
    currentTour: null,
    currentStop: null
  });

  // Refs for tour system
  const cameraRef = useRef();
  const planetRefs = useRef({});

  // Handler for tour state changes (memoized to prevent infinite loops)
  const handleTourStateChange = useCallback((newTourState) => {
    console.log('🎯 Tour state changing:', newTourState);
    setTourState(newTourState);
  }, []);


  // Debug: Log tourState changes
  useEffect(() => {
    console.log('📊 Tour state updated:', tourState);
    console.log('🔒 OrbitControls should be enabled:', viewMode === 'free' && !tourState.isActive);
  }, [tourState, viewMode]);


  // Update simulation time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimulationTime(prev => prev + (0.016 * timeSpeed)); // 60fps
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setHours(newDate.getHours() + (0.016 * timeSpeed) / 3600);
        return newDate;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, timeSpeed]);

  const handlePlanetClick = (planetInfo) => {
    if (!planetInfo.data.isSun) {
      setFocusedPlanet(planetInfo);

      // Fetch real data từ API
      setLoadingData(true);
      fetch(`http://localhost:3001/api/planet/${planetInfo.name}`)
        .then(res => res.json())
        .then(data => {
          setPlanetData(data);
          setLoadingData(false);
        })
        .catch(err => {
          console.error('Failed to fetch planet data:', err);
          setLoadingData(false);
        });
    }
  };

  // Handler for when tour focuses on a planet (MUST be after handlePlanetClick)
  const handleTourPlanetFocus = useCallback((planetName) => {
    console.log('🎯 Tour focusing on planet:', planetName);

    // If planetName is null, close the panel
    if (!planetName) {
      setFocusedPlanet(null);
      setPlanetData(null);
      return;
    }

    // Find planet in PLANET_DATA
    const planet = PLANET_DATA.find(p =>
      p.name.toLowerCase() === planetName.toLowerCase()
    );

    if (planet && planetRefs.current[planetName]) {
      const planetMesh = planetRefs.current[planetName];

      // Simulate planet click to open info panel
      handlePlanetClick({
        name: planet.name,
        data: planet,
        position: planetMesh.position,
        size: planet.size
      });
    }
  }, [planetRefs, handlePlanetClick]);

  const handlePlanetSelect = (planet) => {
    // Tạo planetInfo giống format khi click
    handlePlanetClick({
      name: planet.name,
      data: planet,
      position: { x: 0, y: 0, z: 0 },
      size: planet.size
    });
  };

  const handleBackToOverview = () => {
    setFocusedPlanet(null);
    setPlanetData(null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed) => {
    setTimeSpeed(speed);
  };

  const handleDateChange = (days) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
    setSimulationTime(prev => prev + (days * 24 * 3600 * 0.01)); // Adjust simulation time
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleToggleOrbits = () => {
    setShowOrbits(!showOrbits);
  };

  // Find Earth for geocentric view
  const earthPlanet = PLANET_DATA.find(p => p.name === 'Earth');

  return (
    <div style={{ width: "100%", height: "100vh", background: "#000", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 20, 50], fov: 60 }}
        style={{ background: "#000000" }}
      >
        {/* Enhanced Star Field */}
        <StarField count={8000} />

        {/* Ánh sáng */}
        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.3} groundColor="#000000" />

        {/* Capture camera ref for tour system */}
        <CameraRefCapture cameraRef={cameraRef} />

        {/* Render tất cả hành tinh với Suspense */}
        <Suspense fallback={<LoadingFallback />}>
          {PLANET_DATA.map((planet) => (
            <group key={planet.name}>
              <Planet
                ref={(el) => {
                  if (el) planetRefs.current[planet.name] = el;
                }}
                data={planet}
                onClick={handlePlanetClick}
                isPaused={focusedPlanet !== null}
                simulationTime={simulationTime}
              />

              {/* Orbital Path */}
              {!planet.isSun && <OrbitalPath planet={planet} showOrbits={showOrbits} />}
            </group>
          ))}
        </Suspense>

        {/* Update TWEEN animations for tour system */}
        <TweenUpdater />

        {/* Điều khiển camera */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          enabled={viewMode === 'free' && !tourState.isActive}
        />

        {/* Camera Controller for focused planet */}
        <CameraController focusedPlanet={focusedPlanet} />

        {/* View Mode Camera Controller */}
        <ViewModeCamera viewMode={viewMode} targetPlanet={earthPlanet} />
      </Canvas>

      {/* Loading Progress Bar */}
      <Loader />

      {/* Time Control */}
      <TimeControl
        isPlaying={isPlaying}
        timeSpeed={timeSpeed}
        currentDate={currentDate}
        onPlayPause={handlePlayPause}
        onSpeedChange={handleSpeedChange}
        onDateChange={handleDateChange}
      />

      {/* View Mode Control */}
      <ViewModeControl
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showOrbits={showOrbits}
        onToggleOrbits={handleToggleOrbits}
      />

      {/* Back Button when focused */}
      {focusedPlanet && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleBackToOverview}
            style={{
              padding: "12px 24px",
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
              border: `2px solid ${focusedPlanet.data.color}`,
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = `${focusedPlanet.data.color}33`;
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.7)";
              e.target.style.transform = "scale(1)";
            }}
          >
            <span style={{ fontSize: "20px" }}>←</span>
            Back to Solar System
          </button>
        </div>
      )}

      {/* Enhanced Planet Info Panel */}
      <EnhancedPlanetPanel
        planet={focusedPlanet}
        planetData={planetData}
        loading={loadingData}
        onClose={handleBackToOverview}
      />

      {/* Planet Search */}
      <PlanetSearch onSelect={handlePlanetSelect} />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          fontFamily: "Arial, sans-serif",
          background: "rgba(0,0,0,0.6)",
          padding: "16px",
          borderRadius: "8px",
          maxWidth: "300px",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px" }}>
          🌌 Solar System Explorer
        </h2>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", lineHeight: "1.5" }}>
          Sử dụng chuột để:
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
          <li>Kéo để xoay</li>
          <li>Cuộn để zoom</li>
          <li>Chuột phải để di chuyển</li>
          <li>Hover vào hành tinh để phóng to</li>
        </ul>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Hành tinh:
        </div>
        {PLANET_DATA.map((planet) => (
          <div
            key={planet.name}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: planet.color,
                marginRight: "8px",
              }}
            />
            <span>{planet.name}</span>
          </div>
        ))}
      </div>

      {/* Tour Manager - AI Guide Tour System */}
      <TourManager
        camera={cameraRef}
        planetRefs={planetRefs}
        onTourStateChange={handleTourStateChange}
        onPlanetFocus={handleTourPlanetFocus}
      />
    </div>
  );
}
