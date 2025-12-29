import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ count = 10000 }) {
    const pointsRef = useRef();

    // Generate random star positions
    const [positions, colors, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Create spherical distribution
            const radius = 100 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Star colors (with slight variation)
            const colorVariation = 0.8 + Math.random() * 0.2;
            colors[i3] = colorVariation;
            colors[i3 + 1] = colorVariation;
            colors[i3 + 2] = 1.0;

            // Star sizes
            sizes[i] = Math.random() * 1.5 + 0.5;
        }

        return [positions, colors, sizes];
    }, [count]);

    // Animate stars with subtle twinkling
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.00005;

            // Update star sizes for twinkling effect
            const sizes = pointsRef.current.geometry.attributes.size.array;
            for (let i = 0; i < sizes.length; i++) {
                sizes[i] = 0.5 + Math.abs(Math.sin(state.clock.getElapsedTime() * 0.5 + i)) * 1.5;
            }
            pointsRef.current.geometry.attributes.size.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={1}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
