import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh, Group } from 'three';
import type { SpaceMember } from '@/services/spaceService';

interface MovableAvatar3DProps {
  member: SpaceMember;
  isCurrentUser?: boolean;
  onPositionChange?: (position: [number, number, number]) => void;
  allMembers?: SpaceMember[];
}

export const MovableAvatar3D: React.FC<MovableAvatar3DProps> = ({ 
  member, 
  isCurrentUser = false,
  onPositionChange,
  allMembers = []
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [position, setPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(
      member.position?.[0] || 0, 
      member.position?.[1] || 0, 
      member.position?.[2] || 0
    )
  );
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3>(position.clone());
  const [hovered, setHovered] = useState(false);
  const [proximityLevel, setProximityLevel] = useState(0); // 0-1, how close to current user
  const [showReaction, setShowReaction] = useState<string | null>(null);
  const [gesture, setGesture] = useState<'idle' | 'wave' | 'clap' | 'dance'>('idle');
  
  const { camera } = useThree();

  // Keyboard movement for current user
  useEffect(() => {
    if (!isCurrentUser) return;

    const moveSpeed = 0.1;
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      let moved = false;
      const newTarget = targetPosition.clone();

      if (keys['w'] || keys['arrowup']) {
        newTarget.z -= moveSpeed;
        moved = true;
      }
      if (keys['s'] || keys['arrowdown']) {
        newTarget.z += moveSpeed;
        moved = true;
      }
      if (keys['a'] || keys['arrowleft']) {
        newTarget.x -= moveSpeed;
        moved = true;
      }
      if (keys['d'] || keys['arrowright']) {
        newTarget.x += moveSpeed;
        moved = true;
      }

      // Gestures
      if (keys['1']) setGesture('wave');
      if (keys['2']) setGesture('clap');
      if (keys['3']) setGesture('dance');

      if (moved) {
        // Boundary check
        newTarget.x = Math.max(-8, Math.min(8, newTarget.x));
        newTarget.z = Math.max(-8, Math.min(8, newTarget.z));
        setTargetPosition(newTarget);
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [isCurrentUser, targetPosition]);

  // Smooth movement and proximity calculation
  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth movement towards target
    position.lerp(targetPosition, 0.1);
    groupRef.current.position.copy(position);

    // Floating animation
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + position.x) * 0.1;
    }

    // Gesture animations
    if (meshRef.current) {
      switch (gesture) {
        case 'wave':
          meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.3;
          break;
        case 'clap':
          meshRef.current.scale.x = 1 + Math.abs(Math.sin(state.clock.elapsedTime * 6)) * 0.2;
          break;
        case 'dance':
          meshRef.current.rotation.y = state.clock.elapsedTime * 2;
          break;
        default:
          meshRef.current.rotation.z = 0;
          meshRef.current.rotation.y = 0;
          meshRef.current.scale.set(1, 1, 1);
      }
    }

    // Calculate proximity to current user (for other avatars)
    if (!isCurrentUser && allMembers.length > 0) {
      const currentUserMember = allMembers.find(m => m.id !== member.id);
      if (currentUserMember?.position) {
        const currentUserPos = new THREE.Vector3(
          currentUserMember.position[0],
          currentUserMember.position[1],
          currentUserMember.position[2]
        );
        const distance = position.distanceTo(currentUserPos);
        // Proximity: 1 = very close (< 2 units), 0 = far (> 8 units)
        const proximity = Math.max(0, Math.min(1, 1 - (distance - 2) / 6));
        setProximityLevel(proximity);
      }
    }

    // Camera follow for current user
    if (isCurrentUser) {
      const cameraOffset = new THREE.Vector3(0, 5, 8);
      const targetCameraPos = position.clone().add(cameraOffset);
      camera.position.lerp(targetCameraPos, 0.05);
      camera.lookAt(position);
      
      onPositionChange?.([position.x, position.y, position.z]);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'away': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getProximityScale = () => {
    if (isCurrentUser) return 1;
    // Avatars get bigger when you're closer to them
    return 0.6 + (proximityLevel * 0.4);
  };

  return (
    <group ref={groupRef}>
      {/* Main Avatar */}
      <mesh 
        ref={meshRef} 
        scale={getProximityScale()}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          if (!isCurrentUser) {
            setShowReaction('👋');
            setTimeout(() => setShowReaction(null), 2000);
          }
        }}
      >
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial
            color={member.avatar.color}
            emissive={member.isSpeaking ? '#22c55e' : isCurrentUser ? '#8b5cf6' : '#000000'}
            emissiveIntensity={member.isSpeaking ? 0.5 : isCurrentUser ? 0.3 : 0}
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>
      </mesh>

      {/* Name Label with proximity opacity */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        opacity={isCurrentUser ? 1 : 0.5 + proximityLevel * 0.5}
      >
        {member.name}
        {isCurrentUser && ' (You)'}
      </Text>

      {/* Avatar Emoji */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
      >
        {member.avatar.emoji}
      </Text>

      {/* Status Indicator */}
      <mesh position={[0.35, 0.35, 0]}>
        <Sphere args={[0.08, 16, 16]}>
          <meshBasicMaterial color={getStatusColor(member.status)} />
        </Sphere>
      </mesh>

      {/* Speaking Indicator - Pulsing Ring */}
      {member.isSpeaking && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshBasicMaterial color="#22c55e" opacity={0.6 + proximityLevel * 0.4} transparent />
        </mesh>
      )}

      {/* Proximity Video Frame (shown when close) */}
      {!isCurrentUser && proximityLevel > 0.5 && (
        <Html position={[0, 1.5, 0]} center>
          <div 
            className="bg-black/80 backdrop-blur-md border-2 border-green-500 rounded-lg p-2"
            style={{
              width: `${100 + proximityLevel * 100}px`,
              opacity: proximityLevel,
            }}
          >
            <div className="aspect-video bg-gray-800 rounded flex items-center justify-center text-white text-xs">
              📹 Video Feed
            </div>
          </div>
        </Html>
      )}

      {/* Reaction Bubble */}
      {showReaction && (
        <Html position={[0, 1.2, 0]} center>
          <div className="text-4xl animate-bounce">{showReaction}</div>
        </Html>
      )}

      {/* Hover Info */}
      {hovered && !isCurrentUser && (
        <Html position={[0, -0.8, 0]} center>
          <div className="bg-purple-900/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs whitespace-nowrap">
            Click to wave • Distance: {(proximityLevel * 10).toFixed(1)}m
          </div>
        </Html>
      )}

      {/* Current user movement indicator */}
      {isCurrentUser && (
        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#8b5cf6" opacity={0.4} transparent />
        </mesh>
      )}
    </group>
  );
};
