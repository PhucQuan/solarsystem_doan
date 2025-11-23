import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";

export default function SaturnRings({ size }) {
  const ringsRef = useRef();
  const [ringTexture, setRingTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      "/textures/2k_saturn_ring_alpha.png",
      (loadedTexture) => {
        setRingTexture(loadedTexture);
        console.log("✅ Loaded Saturn rings texture");
      },
      undefined,
      (error) => {
        console.warn("❌ Failed to load Saturn rings:", error);
      }
    );
  }, []);

  useFrame(() => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[size * 1.2, size * 2.2, 64]} />
      <meshStandardMaterial
        map={ringTexture || undefined}
        color={ringTexture ? "#ffffff" : "#C8A882"}
        transparent
        opacity={ringTexture ? 0.8 : 0.6}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
