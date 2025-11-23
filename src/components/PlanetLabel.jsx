import { Html } from "@react-three/drei";

export default function PlanetLabel({ name, position }) {
  return (
    <Html position={position} center>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {name}
      </div>
    </Html>
  );
}
