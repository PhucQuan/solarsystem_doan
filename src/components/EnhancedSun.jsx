import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export default function EnhancedSun({ size = 3 }) {
    const sunRef = useRef();
    const [texture, setTexture] = useState(null);

    // Load sun texture
    useEffect(() => {
        const loader = new TextureLoader();
        loader.load(
            '/textures/sun.jpg',
            (loadedTexture) => {
                setTexture(loadedTexture);
                console.log('✅ Loaded sun texture');
            },
            undefined,
            (error) => {
                console.warn('❌ Failed to load sun texture:', error);
            }
        );
    }, []);

    useFrame(() => {
        // Rotate sun slowly
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group>
            {/* Main Sun Body */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshStandardMaterial
                    map={texture || undefined}
                    color={texture ? "#ffffff" : "#FDB813"}
                    emissive={texture ? "#FFA500" : "#FFA500"}
                    emissiveMap={texture || undefined}
                    emissiveIntensity={texture ? 1 : 2}
                    toneMapped={false}
                />
            </mesh>

            {/* Sun Glow Effect */}
            <mesh scale={1.1}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial
                    color="#FFA500"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Point light from sun */}
            <pointLight
                position={[0, 0, 0]}
                intensity={5}
                distance={200}
                decay={0.5}
                color="#FFA500"
            />
        </group>
    );
}
