
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MarkerType } from '../types';

interface MarkerProps {
  position: [number, number, number];
  isAnswered: boolean;
  onClick: () => void;
  label: string;
  isGlobalLocked: boolean;
  markerType: MarkerType;
}

export const Marker: React.FC<MarkerProps> = ({ position, isAnswered, onClick, label, isGlobalLocked, markerType }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);

  // Глобус бетіне перпендикуляр тұру үшін ориентация
  const quaternion = useMemo(() => {
    const posVec = new THREE.Vector3(...position).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    return new THREE.Quaternion().setFromUnitVectors(up, posVec);
  }, [position]);

  // Деталдандырылған 3D модельдер
  const DetailedModel = useMemo(() => {
    const color = isAnswered ? "#4ade80" : "#ef4444";
    const metalness = 0.8;
    const roughness = 0.2;

    switch (markerType) {
      case 'tower': // Мұнара (Эйфель немесе телемұнара стилі)
        return (
          <group scale={0.8}>
            {/* Негізі */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.1, 4]} />
              <meshStandardMaterial color={color} metalness={metalness} />
            </mesh>
            {/* Ортанғы бөлік */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.15, 0.5, 4]} />
              <meshStandardMaterial color={color} metalness={metalness} />
            </mesh>
            {/* Шпиль (ұшы) */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.01, 0.02, 0.2, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      case 'pyramid': // Сатылы Пирамида
        return (
          <group scale={1.1}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.4]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.25, 0.1, 0.25]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.1, 0.2, 4]} />
              <meshStandardMaterial color={isAnswered ? color : "#ffd700"} metalness={1} />
            </mesh>
          </group>
        );
      case 'temple': // Күмбезді Мавзолей/Ғибадатхана
        return (
          <group scale={0.8}>
            {/* Тұғыр */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.4]} />
              <meshStandardMaterial color={color} metalness={0.5} />
            </mesh>
            {/* Негізгі корпус */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.2, 12]} />
              <meshStandardMaterial color={color} metalness={0.3} />
            </mesh>
            {/* Күмбез */}
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={isAnswered ? color : "#ffffff"} metalness={0.9} />
            </mesh>
          </group>
        );
      case 'monument': // Монумент/Статуя стилі
        return (
          <group scale={0.8}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
              <meshStandardMaterial color={color} metalness={1} />
            </mesh>
            <mesh position={[0.1, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.03, 0.2, 0.03]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case 'mountain': // Қарлы тау
        return (
          <group scale={1.4}>
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.25, 0.4, 7]} />
              <meshStandardMaterial color={color} roughness={1} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.1, 0.15, 7]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
          </group>
        );
      case 'modern': // Заманауи архитектура (Сидней немесе футуристік)
        return (
          <group scale={0.8}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.2, 0.05, 8, 3]} />
              <meshStandardMaterial color={color} metalness={1} />
            </mesh>
            <mesh position={[0, 0.1, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
              <sphereGeometry args={[0.15, 16, 16, 0, Math.PI, 0, Math.PI]} />
              <meshStandardMaterial color={color} transparent opacity={0.6} />
            </mesh>
          </group>
        );
      case 'nature': // Табиғат/Орман (Ағаштар композициясы)
        return (
          <group scale={0.8}>
            {[0, 1, 2].map((i) => (
              <group key={i} position={[Math.sin(i * 2) * 0.15, 0, Math.cos(i * 2) * 0.15]}>
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
                  <meshStandardMaterial color="#5d4037" />
                </mesh>
                <mesh position={[0, 0.2, 0]}>
                  <coneGeometry args={[0.1, 0.3, 6]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              </group>
            ))}
          </group>
        );
      default:
        return (
          <mesh>
            <octahedronGeometry args={[0.15]} />
            <meshStandardMaterial color={color} metalness={1} />
          </mesh>
        );
    }
  }, [markerType, isAnswered]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    if (!isAnswered && !isGlobalLocked) {
      // Көтеріліп-түсу анимациясы
      meshRef.current.position.y = Math.sin(time * 3) * 0.05;
      // Ақырын айналу
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      <group 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isAnswered && !isGlobalLocked) onClick();
        }}
        onPointerOver={() => !isGlobalLocked && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {DetailedModel}
        
        {/* Жарық эффектісі */}
        <pointLight 
          color={isAnswered ? "#4ade80" : "#ef4444"} 
          intensity={hovered ? 3 : 0.8} 
          distance={1.5} 
        />
      </group>

      {/* Астындағы беттік шеңбер */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[0.25, 0.3, 32]} />
        <meshBasicMaterial 
          color={isAnswered ? "#4ade80" : "#ef4444"} 
          transparent 
          opacity={hovered ? 0.8 : 0.3} 
        />
      </mesh>

      {(hovered || isAnswered) && !isGlobalLocked && (
        <Html distanceFactor={10} position={[0, 0.8, 0]} center>
          <div className={`px-4 py-1.5 bg-black/90 backdrop-blur-xl border border-white/20 rounded-full text-[11px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap shadow-2xl transition-all duration-300 transform ${hovered ? 'scale-110 -translate-y-2' : 'scale-100 opacity-70'}`}>
            <span className={isAnswered ? 'text-green-400' : 'text-blue-400'}>{label}</span>
            {isAnswered && <span className="ml-2 text-green-400">✓</span>}
          </div>
        </Html>
      )}
    </group>
  );
};
