import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import PlanetLabel from "./PlanetLabel";

export default function Planet({ data }) {
  const meshRef = useRef();
  const cloudsRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [cloudsTexture, setCloudsTexture] = useState(null);

  // Load textures manually
  useEffect(() => {
    const loader = new TextureLoader();
    
    if (data.texturePath) {
      loader.load(
        data.texturePath,
        (loadedTexture) => {
          setTexture(loadedTexture);
          console.log(`✅ Loaded texture for ${data.name}`);
        },
        undefined,
        (error) => {
          console.warn(`❌ Failed to load texture for ${data.name}:`, error);
        }
      );
    }
    
    if (data.cloudsTexture) {
      loader.load(
        data.cloudsTexture,
        (loadedTexture) => {
          setCloudsTexture(loadedTexture);
          console.log(`✅ Loaded clouds texture for ${data.name}`);
        },
        undefined,
        (error) => {
          console.warn(`❌ Failed to load clouds texture for ${data.name}:`, error);
        }
      );
    }
  }, [data.texturePath, data.cloudsTexture, data.name]);

  // Animation: Quay quanh trục và quỹ đạo
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (meshRef.current) {
      // Tự quay quanh trục của hành tinh
      meshRef.current.rotation.y += data.rotationSpeed;
    }

    // Clouds rotate slightly faster for Earth
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += data.rotationSpeed * 1.2;
    }

    if (groupRef.current && !data.isSun) {
      // Quay quanh Mặt Trời theo quỹ đạo tròn
      const angle = elapsed * data.speed;
      groupRef.current.position.x = Math.cos(angle) * data.distance;
      groupRef.current.position.z = Math.sin(angle) * data.distance;
    }
  });

  // Tạo đường quỹ đạo
  const orbitPoints = [];
  if (!data.isSun) {
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      orbitPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        )
      );
    }
  }

  return (
    <>
      {/* Đường quỹ đạo */}
      {!data.isSun && orbitPoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitPoints.length}
              array={new Float32Array(
                orbitPoints.flatMap((p) => [p.x, p.y, p.z])
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
        </line>
      )}

      {/* Hành tinh */}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[data.size, 64, 64]} />
          {data.isSun ? (
            <meshBasicMaterial
              map={texture}
              color={data.color}
              emissive={data.emissive || data.color}
              emissiveIntensity={data.emissiveIntensity || 0.5}
            />
          ) : (
            <meshStandardMaterial
              map={texture}
              color={texture ? "#ffffff" : data.color}
              roughness={0.7}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Earth Clouds Layer */}
        {cloudsTexture && data.name === "Earth" && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[data.size * 1.01, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Label tên hành tinh khi hover */}
        {hovered && <PlanetLabel name={data.name} position={[0, data.size + 1.5, 0]} />}
      </group>
    </>
  );
}
