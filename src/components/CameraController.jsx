import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

export default function CameraController({ focusedPlanet, onFocusComplete }) {
  const { camera, controls } = useThree();
  const initialPosition = useRef({ x: 0, y: 20, z: 50 });
  const initialTarget = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!controls) return;

    if (focusedPlanet) {
      // Save initial position if first time
      if (!initialPosition.current.saved) {
        initialPosition.current = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
          saved: true,
        };
        initialTarget.current = {
          x: controls.target.x,
          y: controls.target.y,
          z: controls.target.z,
        };
      }

      // Calculate camera position near the planet
      const planetPos = focusedPlanet.position;
      const distance = focusedPlanet.size * 3; // Distance from planet surface

      const targetCameraPos = {
        x: planetPos.x + distance,
        y: planetPos.y + distance * 0.5,
        z: planetPos.z + distance,
      };

      // Animate camera to planet
      gsap.to(camera.position, {
        x: targetCameraPos.x,
        y: targetCameraPos.y,
        z: targetCameraPos.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      // Animate controls target to planet center
      gsap.to(controls.target, {
        x: planetPos.x,
        y: planetPos.y,
        z: planetPos.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update();
        },
        onComplete: () => {
          if (onFocusComplete) onFocusComplete();
        },
      });

      // Adjust controls limits for close view
      controls.minDistance = focusedPlanet.size * 1.5;
      controls.maxDistance = focusedPlanet.size * 10;
    } else {
      // Return to overview
      gsap.to(camera.position, {
        x: initialPosition.current.x,
        y: initialPosition.current.y,
        z: initialPosition.current.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        x: initialTarget.current.x,
        y: initialTarget.current.y,
        z: initialTarget.current.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update();
        },
      });

      // Reset controls limits
      controls.minDistance = 10;
      controls.maxDistance = 100;
    }
  }, [focusedPlanet, camera, controls, onFocusComplete]);

  return null;
}
