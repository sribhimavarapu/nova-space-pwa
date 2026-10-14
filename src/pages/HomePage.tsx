import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings, Search, Bell, UserCircle, LogIn, Globe, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { spaceService, Space } from '@/services/spaceService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mySpaces, setMySpaces] = useState<Space[]>([]);
  const [discoverSpaces, setDiscoverSpaces] = useState<Space[]>([]);
  const [canCreateSpace, setCanCreateSpace] = useState(true);
  const [spaceCount, setSpaceCount] = useState(0);

  useEffect(() => {
    // Load user's spaces
    const mySpaceIds = spaceService.getMySpaces();
    const allSpaces = spaceService.getAllSpaces();
    const userSpaces = allSpaces.filter(s => mySpaceIds.includes(s.id));
    const otherSpaces = allSpaces.filter(s => !mySpaceIds.includes(s.id));
    
    setMySpaces(userSpaces);
    setDiscoverSpaces(otherSpaces);
    
    const check = spaceService.canCreateSpace();
    setCanCreateSpace(check.allowed);
    setSpaceCount(spaceService.getUserSpaceCount());
  }, []);

  const currentUser = spaceService.getCurrentUser();

  const getTemplateIcon = (template: string) => {
    const iconMap: Record<string, string> = {
      meeting: '💼',
      gaming: '🎮',
      study: '📚',
      creative: '🎨',
    };
    return iconMap[template] || '🏛️';
  };

  const getTemplateGradient = (template: string) => {
    const gradientMap: Record<string, string> = {
      meeting: 'from-green-500 to-emerald-600',
      gaming: 'from-purple-500 to-pink-600',
      study: 'from-blue-500 to-cyan-600',
      creative: 'from-cyan-500 to-blue-600',
    };
    return gradientMap[template] || 'from-purple-500 to-pink-600';
  };

  const isSpaceActive = (space: Space) => {
    const timeDiff = Date.now() - new Date(space.lastActive).getTime();
    return timeDiff < 3600000; // Active if updated within last hour
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
              Nova Space
            </h1>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/join')}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-200 hover:text-white hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/avatar')}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-transform">
                {currentUser.avatar?.emoji || <UserCircle className="w-6 h-6 text-white" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-purple-200 text-lg">
            You have {spaceCount} / 3 spaces
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/create-space')}
            disabled={!canCreateSpace}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Space {!canCreateSpace && '(Limit Reached)'}
          </Button>
          <Button
            onClick={() => navigate('/join')}
            variant="outline"
            className="w-full bg-white/5 border-2 border-purple-500/30 hover:border-purple-400 text-white font-semibold py-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] text-lg"
          >
            <LogIn className="w-6 h-6 mr-2" />
            Join a Space
          </Button>
        </div>

        {/* Your Spaces Section */}
        {mySpaces.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Your Spaces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySpaces.map((space) => {
                const gradient = getTemplateGradient(space.template);
                const icon = getTemplateIcon(space.template);
                const active = isSpaceActive(space);
                
                return (
                  <Card
                    key={space.id}
                    onClick={() => navigate(`/room/${space.id}`)}
                    onMouseEnter={() => setHoveredCard(space.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative overflow-hidden cursor-pointer bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-6 transition-all duration-300 ${
                      hoveredCard === space.id ? 'scale-105 shadow-2xl shadow-purple-500/40' : 'shadow-lg'
                    }`}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                    
                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {icon}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                            <Users className="w-4 h-4 text-purple-300" />
                            <span className="text-sm font-medium text-purple-200">{space.members.length}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                            space.privacy === 'public' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {space.privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {space.privacy}
                          </div>
                        </div>
                      </div>

                      {/* Space Info */}
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors">
                          {space.name}
                        </h4>
                        <p className="text-sm text-purple-300 line-clamp-2">{space.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                          }`} />
                          <p className="text-xs text-purple-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {active ? 'Active now' : getTimeAgo(space.lastActive)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Discover Spaces Section */}
        {discoverSpaces.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Discover Spaces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverSpaces.slice(0, 4).map((space) => {
                const gradient = getTemplateGradient(space.template);
                const icon = getTemplateIcon(space.template);
                const currentUserMember = space.members.find(m => m.id === currentUser.id);
                
                return (
                  <Card
                    key={space.id}
                    className="group bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-purple-100 transition-colors">
                            {space.name}
                          </h4>
                          {space.privacy === 'private' && <Lock className="w-4 h-4 text-orange-400" />}
                        </div>
                        <p className="text-sm text-purple-300">{space.members.length} members • {space.ownerName}</p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-200 mb-4 line-clamp-2">{space.description}</p>
                    <Button
                      onClick={() => navigate(`/join`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                    >
                      {space.privacy === 'public' ? 'Join Space' : 'Request to Join'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {mySpaces.length === 0 && discoverSpaces.length === 0 && (
          <Card className="bg-purple-900/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-2xl font-bold text-white mb-2">No spaces yet</h3>
            <p className="text-purple-200 mb-6">Create your first space to get started!</p>
            <Button
              onClick={() => navigate('/create-space')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Space
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default HomePage;
