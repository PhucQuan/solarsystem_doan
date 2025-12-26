import { useRef } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function OrbitalPath({ planet, showOrbits }) {
    if (!showOrbits || planet.isSun) return null;

    // Tạo đường quỹ đạo hình tròn/elip
    const points = [];
    const segments = 128;
    const radius = planet.distance;

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, 0, z));
    }

    return (
        <group>
            {/* Đường quỹ đạo */}
            <Line
                points={points}
                color={planet.color}
                lineWidth={1.5}
                opacity={0.3}
                transparent
                dashed={false}
            />
        </group>
    );
}
