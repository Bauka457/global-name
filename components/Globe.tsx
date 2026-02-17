
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Question } from '../types';
import { Marker } from './Marker';

interface GlobeProps {
  questions: Question[];
  answeredIds: number[];
  onMarkerClick: (q: Question) => void;
  focusQuestion: Question | null;
}

export const Globe: React.FC<GlobeProps> = ({ questions, answeredIds, onMarkerClick, focusQuestion }) => {
  const globeRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const defaultCamPos = useMemo(() => new THREE.Vector3(0, 10, 30), []);

  const getPos = (lat: number, lng: number, r: number = 5): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  useFrame(() => {
    if (focusQuestion) {
      const targetPos = getPos(focusQuestion.lat, focusQuestion.lng, 9);
      camera.position.lerp(targetPos, 0.1);
      camera.lookAt(0, 0, 0);
    } else {
      if (camera.position.length() < 12) {
        camera.position.lerp(defaultCamPos, 0.05);
        camera.lookAt(0, 0, 0);
      }
    }
  });

  const [colorMap, normalMap, roughnessMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  return (
    <group ref={globeRef} position={[0, 0, 0]}>
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          roughnessMap={roughnessMap}
          roughness={0.6}
          metalness={0.15}
          emissive="#112233"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial 
          color="#88ccff" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {questions.map((q) => (
        <Marker 
          key={q.id}
          position={getPos(q.lat, q.lng, 5.1).toArray() as [number, number, number]}
          isAnswered={answeredIds.includes(q.id)}
          onClick={() => onMarkerClick(q)}
          label={q.locationName}
          isGlobalLocked={!!focusQuestion}
          markerType={q.markerType}
        />
      ))}

      <Moon orbitalRadius={15} />
    </group>
  );
};

const Moon: React.FC<{ orbitalRadius: number }> = ({ orbitalRadius }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.2;
    if (moonRef.current) {
      moonRef.current.position.set(
        Math.cos(t) * orbitalRadius,
        0,
        Math.sin(t) * orbitalRadius
      );
      moonRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={moonRef} castShadow receiveShadow>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial map={moonTexture} roughness={0.9} />
    </mesh>
  );
};
