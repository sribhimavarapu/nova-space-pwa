import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Plane } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Room3D Component
 * Represents a virtual 3D room environment
 * Includes floor, walls, and interactive objects
 */

export const Room3D: React.FC = () => {
  return (
    <>
      {/* Floor */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#2d3748" />
      </Plane>

      {/* Back Wall */}
      <Plane
        args={[20, 10]}
        position={[0, 5, -10]}
        receiveShadow
      >
        <meshStandardMaterial color="#1a202c" />
      </Plane>

      {/* Left Wall */}
      <Plane
        args={[20, 10]}
        rotation={[0, Math.PI / 2, 0]}
        position={[-10, 5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#1a202c" />
      </Plane>

      {/* Right Wall */}
      <Plane
        args={[20, 10]}
        rotation={[0, -Math.PI / 2, 0]}
        position={[10, 5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#1a202c" />
      </Plane>

      {/* Interactive Objects */}
      <FloatingCube position={[-3, 2, -5]} color="#8b5cf6" />
      <FloatingCube position={[3, 2, -5]} color="#ec4899" />
      <FloatingCube position={[0, 2, -7]} color="#3b82f6" />
      
      {/* Avatar Placeholder */}
      <AvatarSphere position={[0, 1, 0]} />
    </>
  );
};

/**
 * Floating Cube - Interactive 3D object
 */
interface FloatingCubeProps {
  position: [number, number, number];
  color: string;
}

const FloatingCube: React.FC<FloatingCubeProps> = ({ position, color }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[1, 1, 1]}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <meshStandardMaterial 
        color={color} 
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </Box>
  );
};

/**
 * Avatar Sphere - Represents user avatar in 3D space
 */
interface AvatarSphereProps {
  position: [number, number, number];
}

const AvatarSphere: React.FC<AvatarSphereProps> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#f59e0b" />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.1, 16, 16]} position={[-0.2, 0.2, 0.4]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.2, 0.2, 0.4]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
    </group>
  );
};
