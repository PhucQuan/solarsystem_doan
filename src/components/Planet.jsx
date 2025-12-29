import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import PlanetLabel from "./PlanetLabel";
import Atmosphere from "./Atmosphere";
import SaturnRings from "./SaturnRings";

export default function Planet({ data, onClick, isPaused, simulationTime = 0 }) {
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
          // Force material update
          if (meshRef.current) {
            meshRef.current.material.needsUpdate = true;
          }
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

  // Animation: Quay quanh trục và quỹ đạo (sử dụng simulationTime từ props)
  useFrame(() => {
    if (meshRef.current) {
      // Tự quay quanh trục của hành tinh
      meshRef.current.rotation.y += data.rotationSpeed;
    }

    // Clouds rotate slightly faster for Earth
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += data.rotationSpeed * 1.2;
    }

    if (groupRef.current && !data.isSun && !isPaused) {
      // Quay quanh Mặt Trời theo quỹ đạo tròn dựa trên simulationTime
      const angle = simulationTime * data.speed + (data.startAngle || 0);
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
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            if (!data.isSun) {
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "default";
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Planet clicked:", data.name);
            if (onClick && !data.isSun) {
              onClick({
                name: data.name,
                position: groupRef.current.position,
                size: data.size,
                data: data,
              });
            }
          }}
          scale={hovered && !data.isSun ? 1.2 : 1}
        >
          <sphereGeometry args={[data.size, 64, 64]} />
          {data.isSun ? (
            <meshStandardMaterial
              key={texture ? 'textured' : 'solid'}
              map={texture || undefined}
              color={texture ? "#ffffff" : data.color}
              emissive={texture ? "#FFA500" : data.color}
              emissiveMap={texture || undefined}
              emissiveIntensity={texture ? 2 : 1}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              key={texture ? 'textured' : 'solid'}
              map={texture || undefined}
              color={texture ? "#ffffff" : data.color}
              roughness={0.7}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Sun Glow Effect */}
        {data.isSun && (
          <mesh scale={1.1}>
            <sphereGeometry args={[data.size, 32, 32]} />
            <meshBasicMaterial
              color="#FFA500"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        )}

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

        {/* Earth Atmosphere */}
        {data.name === "Earth" && <Atmosphere size={data.size} color="#4A90E2" />}

        {/* Saturn Rings */}
        {data.name === "Saturn" && <SaturnRings size={data.size} />}

        {/* Label tên hành tinh khi hover */}
        {hovered && <PlanetLabel name={data.name} position={[0, data.size + 1.5, 0]} />}
      </group>
    </>
  );
}
