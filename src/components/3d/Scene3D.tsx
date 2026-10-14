import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Scene3D Component
 * Base 3D scene component using React Three Fiber
 * Provides camera controls and basic lighting setup
 */

interface Scene3DProps {
  children?: React.ReactNode;
  showControls?: boolean;
  cameraPosition?: [number, number, number];
}

export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  showControls = true,
  cameraPosition = [0, 0, 5],
}) => {
  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={cameraPosition} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Content */}
      {children}
      
      {/* Controls */}
      {showControls && (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          enableZoom={true}
          enablePan={true}
        />
      )}
    </Canvas>
  );
};

/**
 * Basic Box Component for testing
 */
interface Box3DProps {
  position?: [number, number, number];
  color?: string;
}

export const Box3D: React.FC<Box3DProps> = ({ 
  position = [0, 0, 0], 
  color = '#6366f1' 
}) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
