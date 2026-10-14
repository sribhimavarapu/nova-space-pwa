import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { 
  ArrowLeft, Share2, Settings, Users, MessageSquare, Mic, MicOff, 
  Video, VideoOff, Monitor, MoreVertical, UserPlus, Crown, Shield,
  Phone, Smile, Hand, Sparkles, Grid3x3, Maximize2, X
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { ShareSpaceModal } from '@/components/ShareSpaceModal';
import { SimpleImmersiveRoom } from '@/components/3d';
import { spaceService, Space, SpaceMember } from '@/services/spaceService';

const EnhancedRoomPage: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ user: string; text: string; time: string }>>([]);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showObjectModal, setShowObjectModal] = useState<{ type: string; show: boolean }>({ type: '', show: false });
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (spaceId) {
      const loadedSpace = spaceService.getSpaceById(spaceId);
      setSpace(loadedSpace);
      
      setMessages([
        { user: 'Tony Stark', text: 'Welcome to the space! Use WASD to move around.', time: '10:30 AM' },
        { user: 'Steve Rogers', text: 'Try clicking on the whiteboards and screens!', time: '10:32 AM' },
      ]);
    }
  }, [spaceId]);

  if (!space) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🚀</div>
          <p className="text-white text-xl">Loading immersive space...</p>
        </div>
      </div>
    );
  }

  const currentUser = spaceService.getCurrentUser();
  const isOwner = space.ownerId === currentUser.id;
  const userMember = space.members.find(m => m.id === currentUser.id);
  const isAdmin = userMember?.role === 'admin' || isOwner;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setMessages([...messages, {
        user: currentUser.name,
        text: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatMessage('');
    }
  };

  const handleLeave = () => {
    if (isOwner) {
      if (confirm('Delete this space? This cannot be undone.')) {
        spaceService.deleteSpace(space.id);
        navigate('/home');
      }
    } else {
      spaceService.leaveSpace(space.id);
      navigate('/home');
    }
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    setMessages([...messages, {
      user: currentUser.name,
      text: emoji,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setTimeout(() => setSelectedReaction(null), 2000);
  };

  const handleObjectInteract = (objectType: string) => {
    if (objectType === 'screen') {
      setIsScreenSharing(!isScreenSharing);
      setMessages([...messages, {
        user: 'System',
        text: `${currentUser.name} ${isScreenSharing ? 'stopped' : 'started'} screen sharing`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } else if (objectType === 'whiteboard') {
      setShowObjectModal({ type: 'whiteboard', show: true });
    } else if (objectType.startsWith('breakout')) {
      setShowObjectModal({ type: 'breakout', show: true });
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'owner') return <Crown className="w-4 h-4 text-yellow-400" />;
    if (role === 'admin') return <Shield className="w-4 h-4 text-blue-400" />;
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const reactions = ['👍', '👏', '😂', '❤️', '🎉', '🤔', '🚀', '✨'];

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden`}>
      {/* 3D Canvas - Full Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={75} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <SimpleImmersiveRoom 
            members={space.members}
            currentUserId={currentUser.id}
            
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/home')}
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    {space.name}
                    <span className="text-xs bg-green-500 px-2 py-1 rounded-full">LIVE</span>
                  </h1>
                  <p className="text-purple-200 text-sm">{space.members.length} in space</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFullscreen(!fullscreen)}
                  className="text-white hover:bg-white/10"
                >
                  {fullscreen ? <Grid3x3 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShare(true)}
                  className="text-white hover:bg-white/10"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Participants Panel */}
          {showParticipants && (
            <div className="w-80 bg-gradient-to-b from-purple-900/40 to-indigo-900/40 backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  In Space ({space.members.length})
                </h2>
                {isAdmin && (
                  <Button variant="ghost" size="icon" className="text-purple-200 hover:bg-white/10">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {space.members.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                          {member.avatar.emoji}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium truncate">{member.name}</p>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-purple-300 text-xs truncate">{member.avatar.name}</p>
                      </div>
                      {member.isSpeaking && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-green-500 rounded animate-pulse" />
                          <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pending Requests */}
              {isAdmin && space.pendingRequests.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-purple-200 text-sm font-semibold mb-2">Waiting to Join</h3>
                  <div className="space-y-2">
                    {space.pendingRequests.map((request) => (
                      <Card key={request.userId} className="bg-orange-900/20 border-orange-500/30 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm">{request.userName}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                spaceService.approveJoinRequest(space.id, request.userId);
                                setSpace(spaceService.getSpaceById(space.id));
                              }}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-gradient-to-b from-purple-900/40 to-indigo-900/40 backdrop-blur-md border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Space Chat
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-purple-200 text-sm font-medium">{msg.user}</p>
                      <p className="text-purple-400 text-xs">{msg.time}</p>
                    </div>
                    <p className="text-white text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2 mb-2">
                  {reactions.slice(0, 4).map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleReaction(emoji)}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder:text-purple-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button type="submit" size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Send
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowParticipants(!showParticipants)}
                  className={`text-white hover:bg-white/10 ${showParticipants ? 'bg-white/10' : ''}`}
                >
                  <Users className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(!showChat)}
                  className={`text-white hover:bg-white/10 ${showChat ? 'bg-white/10' : ''}`}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-12 h-12 rounded-full ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleObjectInteract('screen')}
                  className={`w-12 h-12 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Monitor className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLeave}
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <Phone className="w-5 h-5 transform rotate-[135deg]" />
                </Button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <div className="bg-white/10 px-3 py-1 rounded-full text-purple-200 text-sm">
                  Use WASD to move
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareSpaceModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        spaceId={space.id}
        spaceName={space.name}
        inviteLink={spaceService.getInviteLink(space.id)}
      />

      {/* Object Interaction Modals */}
      {showObjectModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                {showObjectModal.type === 'whiteboard' ? '📋 Whiteboard' : '💬 Breakout Room'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowObjectModal({ type: '', show: false })} className="text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="bg-white rounded-xl h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {showObjectModal.type === 'whiteboard' 
                  ? 'Whiteboard feature coming soon! 🎨' 
                  : 'Breakout room feature coming soon! 🎉'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedRoomPage;

