import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Loader } from "@react-three/drei";
import Planet from "./Planet";
import { PLANET_DATA } from "../data/solarSystemData";

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#444444" wireframe />
    </mesh>
  );
}

export default function SolarSystem() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#000" }}>
      <Canvas
        camera={{ position: [0, 20, 50], fov: 60 }}
        style={{ background: "#000000" }}
      >
        {/* Nền vũ trụ với sao */}
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={7}
          saturation={0}
          fade
          speed={1}
        />

        {/* Ánh sáng */}
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={5} distance={200} decay={0.5} />
        <hemisphereLight intensity={0.3} groundColor="#000000" />

        {/* Render tất cả hành tinh với Suspense */}
        <Suspense fallback={<LoadingFallback />}>
          {PLANET_DATA.map((planet) => (
            <Planet key={planet.name} data={planet} />
          ))}
        </Suspense>

        {/* Điều khiển camera */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>

      {/* Loading Progress Bar */}
      <Loader />

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
    </div>
  );
}
