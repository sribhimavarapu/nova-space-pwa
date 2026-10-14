import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Lock, Globe, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { spaceService, Space } from '@/services/spaceService';

const JoinSpacePage: React.FC = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const [searchTerm, setSearchTerm] = useState(inviteCode || '');
  const [spaces, setSpaces] = useState<Space[]>(spaceService.getAllSpaces());
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const found = spaceService.getSpaceByInviteCode(searchTerm.toUpperCase());
      setSpaces(found ? [found] : []);
    } else {
      setSpaces(spaceService.getAllSpaces());
    }
  };

  const handleJoin = (spaceId: string, spaceName: string) => {
    const result = spaceService.joinSpace(spaceId);
    
    if (result.success) {
      if (result.needsApproval) {
        setMessage({ type: 'success', text: `Join request sent for "${spaceName}"` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        navigate(`/room/${spaceId}`);
      }
    } else {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const currentUser = spaceService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-purple-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join a Space
          </h1>
          <p className="text-purple-200 text-lg">Discover and join virtual spaces</p>
        </div>

        {/* Search */}
        <Card className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter invite code or search..."
              className="flex-1 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
            />
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Message */}
        {message && (
          <Card className={`mb-6 backdrop-blur-md border p-4 ${
            message.type === 'success' 
              ? 'bg-green-900/40 border-green-500/30' 
              : 'bg-red-900/40 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                {message.text}
              </p>
            </div>
          </Card>
        )}

        {/* Spaces List */}
        <div className="grid md:grid-cols-2 gap-6">
          {spaces.map((space) => {
            const isMember = space.members.some(m => m.id === currentUser.id);
            const hasPendingRequest = space.pendingRequests.some(r => r.userId === currentUser.id);
            
            return (
              <Card
                key={space.id}
                className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{space.name}</h3>
                    <p className="text-purple-200 text-sm mb-3">{space.description}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    space.privacy === 'public' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {space.privacy === 'public' ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-purple-200 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{space.members.length} / {space.maxMembers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(space.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-purple-300 text-sm">Code:</span>
                  <code className="px-2 py-1 bg-white/10 rounded text-purple-200 font-mono text-sm">
                    {space.inviteCode}
                  </code>
                </div>

                {isMember ? (
                  <Button
                    onClick={() => navigate(`/room/${space.id}`)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Enter Space
                  </Button>
                ) : hasPendingRequest ? (
                  <Button disabled className="w-full bg-gray-600 cursor-not-allowed">
                    Request Pending
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoin(space.id, space.name)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {space.privacy === 'public' ? 'Join Space' : 'Request to Join'}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {spaces.length === 0 && (
          <Card className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">No spaces found</p>
          </Card>
        )}
      </div>
    </div>
  );
};


export default JoinSpacePage;

