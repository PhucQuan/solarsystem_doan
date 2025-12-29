import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Atmosphere({ size, color = "#4A90E2" }) {
  const atmosphereRef = useRef();

  useFrame(() => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={atmosphereRef} scale={1.15}>
      <sphereGeometry args={[size, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
          }
        `}
        uniforms={{
          glowColor: { value: new THREE.Color(color) },
        }}
      />
    </mesh>
  );
}
