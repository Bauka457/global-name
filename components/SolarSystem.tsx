
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANETS } from '../constants';

export const SolarSystem: React.FC = () => {
  // Central position for orbits remains the same for consistency, but the Sun object is removed.
  const sunPos: [number, number, number] = [-350, 150, -600];

  return (
    <group>
      {/* Sun visual object and its point light have been removed per user request */}
      
      {/* Solar System Planets */}
      {PLANETS.map((planet) => (
        <PlanetOrbit 
          key={planet.name} 
          name={planet.name}
          color={planet.color}
          distance={planet.distance}
          size={planet.size}
          speed={planet.speed}
          rings={planet.rings}
          sunPos={sunPos} 
        />
      ))}
    </group>
  );
};

interface PlanetProps {
  name: string;
  color: string;
  distance: number;
  size: number;
  speed: number;
  rings?: boolean;
  sunPos: [number, number, number];
}

const PlanetOrbit: React.FC<PlanetProps> = ({ color, distance, size, speed, rings, sunPos }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * speed) + randomOffset;
    if (orbitGroupRef.current) {
      // Maintaining the orbit radius logic relative to the central point
      const orbitRadius = distance + 450;
      orbitGroupRef.current.position.set(
        Math.cos(t) * orbitRadius + sunPos[0],
        Math.sin(t * 0.02) * 50 + sunPos[1],
        Math.sin(t) * orbitRadius + sunPos[2]
      );
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>
      
      {rings && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.8, size * 3.2, 64]} />
          <meshStandardMaterial 
            color={color} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      )}
    </group>
  );
};
