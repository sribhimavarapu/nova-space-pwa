import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import type { Mesh } from 'three';
import type { SpaceMember } from '@/services/spaceService';

interface Avatar3DProps {
  member: SpaceMember;
  position: [number, number, number];
  onClick?: () => void;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({ member, position, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Slight rotation when speaking
      if (member.isSpeaking) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'away': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Avatar Sphere */}
      <mesh ref={meshRef} scale={hovered ? 1.2 : 1}>
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial
            color={member.avatar.color}
            emissive={member.isSpeaking ? '#22c55e' : '#000000'}
            emissiveIntensity={member.isSpeaking ? 0.5 : 0}
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>
      </mesh>

      {/* Name Label */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {member.name}
      </Text>

      {/* Avatar Emoji (as text above) */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {member.avatar.emoji}
      </Text>

      {/* Status Indicator */}
      <mesh position={[0.4, 0.4, 0]}>
        <Sphere args={[0.08, 16, 16]}>
          <meshBasicMaterial color={getStatusColor(member.status)} />
        </Sphere>
      </mesh>

      {/* Speaking Indicator - Pulsing Ring */}
      {member.isSpeaking && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial color="#22c55e" opacity={0.6} transparent />
        </mesh>
      )}

      {/* Hover Indicator */}
      {hovered && (
        <mesh position={[0, -0.7, 0]}>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

// Room with multiple avatars
interface AvatarRoom3DProps {
  members: SpaceMember[];
  onAvatarClick?: (member: SpaceMember) => void;
}

export const AvatarRoom3D: React.FC<AvatarRoom3DProps> = ({ members, onAvatarClick }) => {
  // Position avatars in a circle
  const getPosition = (index: number, total: number): [number, number, number] => {
    const radius = 3;
    const angle = (index / total) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ];
  };

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e1b4b" opacity={0.8} transparent />
      </mesh>

      {/* Center Platform */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[4, 4, 0.1, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Avatars */}
      {members.map((member, index) => (
        <Avatar3D
          key={member.id}
          member={member}
          position={member.position || getPosition(index, members.length)}
          onClick={() => onAvatarClick?.(member)}
        />
      ))}

      {/* Ambient particles/stars */}
      {[...Array(50)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <Sphere args={[0.02, 8, 8]}>
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </Sphere>
        </mesh>
      ))}
    </>
  );
};
