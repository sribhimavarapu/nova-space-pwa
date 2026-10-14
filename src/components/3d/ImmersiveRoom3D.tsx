import React, { useState, useEffect } from 'react';
import { MovableAvatar3D } from './MovableAvatar3D';
import { ConferenceRoomLayout } from './InteractiveObjects3D';
import { Html } from '@react-three/drei';
import type { SpaceMember } from '@/services/spaceService';

interface ImmersiveRoom3DProps {
  members: SpaceMember[];
  currentUserId: string;
  onMemberPositionUpdate?: (memberId: string, position: [number, number, number]) => void;
  onObjectInteract?: (objectType: string) => void;
}

export const ImmersiveRoom3D: React.FC<ImmersiveRoom3DProps> = ({
  members,
  currentUserId,
  onMemberPositionUpdate,
  onObjectInteract,
}) => {
  const [memberPositions, setMemberPositions] = useState<Record<string, [number, number, number]>>({});
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Hide instructions after 5 seconds
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePositionChange = (memberId: string) => (position: [number, number, number]) => {
    setMemberPositions(prev => ({ ...prev, [memberId]: position }));
    onMemberPositionUpdate?.(memberId, position);
  };

  // Get updated members with current positions
  const getMembersWithPositions = (): SpaceMember[] => {
    return members.map(member => ({
      ...member,
      position: memberPositions[member.id] || member.position,
    }));
  };

  const currentUserMember = members.find(m => m.id === currentUserId);

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1e1b4b" 
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Grid overlay on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#6366f1" 
          opacity={0.1} 
          transparent
          wireframe
        />
      </mesh>

      {/* Room Layout Objects */}
      <ConferenceRoomLayout onObjectClick={onObjectInteract} />

      {/* Avatars */}
      {getMembersWithPositions().map((member) => (
        <MovableAvatar3D
          key={member.id}
          member={member}
          isCurrentUser={member.id === currentUserId}
          onPositionChange={handlePositionChange(member.id)}
          allMembers={getMembersWithPositions()}
        />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ec4899" />
      <pointLight position={[5, 3, -5]} intensity={0.3} color="#06b6d4" />

      {/* Atmospheric particles */}
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

      {/* Instruction Overlay */}
      {showInstructions && currentUserMember && (
        <Html position={[0, 4, -4]} center>
          <div className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl max-w-md">
            <h3 className="text-white font-bold text-lg mb-4 text-center">
              🎮 Controls & Features
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-purple-300 font-semibold mb-1">🕹️ Move</div>
                <div className="text-white text-xs">W A S D / Arrows</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-purple-300 font-semibold mb-1">👋 Gestures</div>
                <div className="text-white text-xs">Press 1, 2, 3</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-purple-300 font-semibold mb-1">📹 Proximity</div>
                <div className="text-white text-xs">Get close = video</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-purple-300 font-semibold mb-1">🔗 Interact</div>
                <div className="text-white text-xs">Click objects</div>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Got it! Let's go 🚀
            </button>
          </div>
        </Html>
      )}
    </>
  );
};
