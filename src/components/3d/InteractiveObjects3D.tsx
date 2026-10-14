import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';
import type { Mesh } from 'three';

interface InteractiveObject3DProps {
  position: [number, number, number];
  type: 'whiteboard' | 'screen' | 'table' | 'chair' | 'plant' | 'breakout-zone';
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const InteractiveObject3D: React.FC<InteractiveObject3DProps> = ({
  position,
  type,
  label,
  onClick,
  isActive = false,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const getObjectGeometry = () => {
    switch (type) {
      case 'whiteboard':
        return (
          <>
            <Box args={[2, 1.5, 0.1]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[1.9, 1.4]} />
              <meshBasicMaterial color="#f0f0f0" />
            </mesh>
          </>
        );
      case 'screen':
        return (
          <>
            <Box args={[3, 2, 0.1]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </Box>
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[2.8, 1.8]} />
              <meshBasicMaterial 
                color={isActive ? '#1e40af' : '#111111'} 
                emissive={isActive ? '#3b82f6' : '#000000'}
                emissiveIntensity={0.5}
              />
            </mesh>
            {isActive && (
              <Text position={[0, 0, 0.11]} fontSize={0.15} color="white" anchorX="center">
                🔴 Screen Sharing Active
              </Text>
            )}
          </>
        );
      case 'table':
        return (
          <Box args={[2, 0.1, 1.2]}>
            <meshStandardMaterial color="#8b4513" roughness={0.8} />
          </Box>
        );
      case 'chair':
        return (
          <group>
            <Box args={[0.5, 0.05, 0.5]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#4a5568" />
            </Box>
            <Box args={[0.5, 0.6, 0.05]} position={[0, 0.3, -0.225]}>
              <meshStandardMaterial color="#4a5568" />
            </Box>
          </group>
        );
      case 'plant':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
        );
      case 'breakout-zone':
        return (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2, 32]} />
              <meshStandardMaterial 
                color="#8b5cf6" 
                opacity={0.3} 
                transparent
                emissive="#a78bfa"
                emissiveIntensity={hovered ? 0.5 : 0.2}
              />
            </mesh>
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.8, 2, 32]} />
              <meshBasicMaterial color="#a78bfa" opacity={0.6} transparent />
            </mesh>
          </>
        );
      default:
        return <Box args={[1, 1, 1]}><meshStandardMaterial color="#888888" /></Box>;
    }
  };

  const getIcon = () => {
    const icons: Record<string, string> = {
      whiteboard: '📋',
      screen: '📺',
      table: '🪡',
      chair: '🪪',
      plant: '🌱',
      'breakout-zone': '💬',
    };
    return icons[type] || '❓';
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getObjectGeometry()}
      </mesh>

      {label && (
        <Text
          position={[0, type === 'breakout-zone' ? 0.1 : 1, 0]}
          fontSize={0.12}
          color={hovered ? '#ffffff' : '#d1d5db'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {getIcon()} {label}
        </Text>
      )}

      {hovered && (
        <Html position={[0, type === 'breakout-zone' ? 0.5 : 1.5, 0]} center>
          <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg text-white text-xs whitespace-nowrap border border-purple-500/50">
            <div className="font-semibold">{label || type}</div>
            <div className="text-purple-300 text-[10px] mt-1">
              {type === 'whiteboard' && 'Click to draw'}
              {type === 'screen' && 'Click to share screen'}
              {type === 'breakout-zone' && 'Enter for private conversation'}
              {(type === 'table' || type === 'chair') && 'Decorative object'}
              {type === 'plant' && 'Adds ambiance 🌿'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Pre-configured room layouts
export const ConferenceRoomLayout: React.FC<{ onObjectClick?: (type: string) => void }> = ({ onObjectClick }) => {
  return (
    <>
      {/* Main screen at front */}
      <InteractiveObject3D 
        position={[0, 1.5, -6]} 
        type="screen" 
        label="Main Screen"
        onClick={() => onObjectClick?.('screen')}
      />

      {/* Conference table */}
      <InteractiveObject3D position={[0, 0.5, 0]} type="table" label="Conference Table" />

      {/* Chairs around table */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 1.5;
        return (
          <InteractiveObject3D
            key={`chair-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.25,
              Math.sin(angle) * radius,
            ]}
            type="chair"
          />
        );
      })}

      {/* Whiteboards on sides */}
      <InteractiveObject3D 
        position={[-5, 1.5, 0]} 
        type="whiteboard" 
        label="Brainstorm Board"
        onClick={() => onObjectClick?.('whiteboard')}
      />
      <InteractiveObject3D 
        position={[5, 1.5, 0]} 
        type="whiteboard" 
        label="Ideas Board"
        onClick={() => onObjectClick?.('whiteboard')}
      />

      {/* Breakout zones in corners */}
      <InteractiveObject3D 
        position={[-6, 0.01, -6]} 
        type="breakout-zone" 
        label="Breakout Room 1"
        onClick={() => onObjectClick?.('breakout-1')}
      />
      <InteractiveObject3D 
        position={[6, 0.01, -6]} 
        type="breakout-zone" 
        label="Breakout Room 2"
        onClick={() => onObjectClick?.('breakout-2')}
      />

      {/* Decorative plants */}
      <InteractiveObject3D position={[-7, 0.3, -7]} type="plant" />
      <InteractiveObject3D position={[7, 0.3, -7]} type="plant" />
      <InteractiveObject3D position={[-7, 0.3, 7]} type="plant" />
      <InteractiveObject3D position={[7, 0.3, 7]} type="plant" />
    </>
  );
};
