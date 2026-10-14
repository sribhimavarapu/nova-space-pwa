import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SpaceMember } from '@/services/spaceService';

interface SimpleAvatar3DProps {
  member: SpaceMember;
  position: [number, number, number];
  isCurrentUser?: boolean;
}

const SimpleAvatar3D: React.FC<SimpleAvatar3DProps> = ({ member, position, isCurrentUser }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Pulsing for speaking
      if (member.isSpeaking && meshRef.current.scale) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        meshRef.current.scale.set(pulse, pulse, pulse);
      }
    }
  });

  const color = member.avatar?.color || '#8b5cf6';
  const emissive = member.isSpeaking ? '#22c55e' : isCurrentUser ? '#8b5cf6' : '#000000';

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={member.isSpeaking ? 0.5 : isCurrentUser ? 0.3 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Status indicator */}
      <mesh position={[0.35, 0.35, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={member.status === 'active' ? '#10b981' : '#f59e0b'} />
      </mesh>

      {/* Speaking ring */}
      {member.isSpeaking && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshBasicMaterial color="#22c55e" opacity={0.6} transparent />
        </mesh>
      )}

      {/* Hover effect */}
      {hovered && (
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
        </mesh>
      )}

      {/* Current user indicator */}
      {isCurrentUser && (
        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#8b5cf6" opacity={0.4} transparent />
        </mesh>
      )}
    </group>
  );
};

interface SimpleImmersiveRoomProps {
  members: SpaceMember[];
  currentUserId: string;
}

export const SimpleImmersiveRoom: React.FC<SimpleImmersiveRoomProps> = ({ members, currentUserId }) => {
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
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ec4899" />
      <pointLight position={[5, 3, -5]} intensity={0.3} color="#06b6d4" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Center platform */}
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

      {/* Grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#6366f1" opacity={0.1} transparent wireframe />
      </mesh>

      {/* Avatars */}
      {members.map((member, index) => (
        <SimpleAvatar3D
          key={member.id}
          member={member}
          position={member.position || getPosition(index, members.length)}
          isCurrentUser={member.id === currentUserId}
        />
      ))}

      {/* Conference Table */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>

      {/* Main Screen */}
      <group position={[0, 1.5, -6]}>
        <mesh>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshBasicMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Side Whiteboards */}
      <group position={[-5, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.9, 1.4]} />
          <meshBasicMaterial color="#f0f0f0" />
        </mesh>
      </group>

      <group position={[5, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.9, 1.4]} />
          <meshBasicMaterial color="#f0f0f0" />
        </mesh>
      </group>

      {/* Breakout zones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, -0.89, -6]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial color="#8b5cf6" opacity={0.6} transparent />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, -0.89, -6]}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial color="#ec4899" opacity={0.6} transparent />
      </mesh>

      {/* Ambient particles */}
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 8,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
      ))}
    </>
  );
};
