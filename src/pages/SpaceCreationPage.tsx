import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Gamepad2, BookOpen, Palette, Globe, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { spaceService } from '@/services/spaceService';

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  maxMembers: number;
}

const templates: Template[] = [
  { id: 'meeting', name: 'Meeting Room', icon: <Users className="w-8 h-8" />, description: 'Professional workspace', maxMembers: 20 },
  { id: 'gaming', name: 'Gaming Lounge', icon: <Gamepad2 className="w-8 h-8" />, description: 'Casual gaming space', maxMembers: 15 },
  { id: 'study', name: 'Study Hall', icon: <BookOpen className="w-8 h-8" />, description: 'Focused learning environment', maxMembers: 25 },
  { id: 'creative', name: 'Creative Studio', icon: <Palette className="w-8 h-8" />, description: 'Collaborative creative space', maxMembers: 12 },
];

const SpaceCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('meeting');
  const [spaceName, setSpaceName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [canCreate, setCanCreate] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [spaceCount, setSpaceCount] = useState(0);

  useEffect(() => {
    const check = spaceService.canCreateSpace();
    setCanCreate(check.allowed);
    if (!check.allowed) {
      setErrorMessage(check.reason || '');
    }
    setSpaceCount(spaceService.getUserSpaceCount());
  }, []);

  const handleCreateSpace = () => {
    if (!spaceName.trim()) {
      setErrorMessage('Please enter a space name');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const newSpace = spaceService.createSpace({
      name: spaceName,
      description,
      template: selectedTemplate,
      privacy,
      maxMembers: template.maxMembers,
    });

    navigate(`/room/${newSpace.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
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
          <div className="text-right">
            <p className="text-purple-200 text-sm">Your Spaces</p>
            <p className="text-white font-semibold">{spaceCount} / 3</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create New Space
          </h1>
          <p className="text-purple-200 text-lg">Design your virtual meeting environment</p>
        </div>

        {/* Error/Warning */}
        {!canCreate && (
          <Card className="mb-6 bg-red-900/40 backdrop-blur-md border border-red-500/30 p-4">
            <div className="flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          </Card>
        )}

        {/* Template Selection */}
        <Card className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Template</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTemplate === template.id
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'bg-purple-900/40 border-white/10 hover:border-purple-400/50'
                }`}
              >
                <div className="text-white mb-3">{template.icon}</div>
                <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                <p className="text-purple-200 text-xs">{template.description}</p>
                <p className="text-purple-300 text-xs mt-2">Max: {template.maxMembers}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Space Details */}
        <Card className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Space Details</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-purple-200 mb-2 block">Space Name</Label>
              <Input
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                placeholder="Enter space name"
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
                disabled={!canCreate}
              />
            </div>
            <div>
              <Label className="text-purple-200 mb-2 block">Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your space..."
                rows={3}
                className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!canCreate}
              />
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPrivacy('public')}
              disabled={!canCreate}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                privacy === 'public'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-purple-900/40 border-white/10 hover:border-purple-400/50'
              }`}
            >
              <Globe className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">Public</h3>
              <p className="text-purple-200 text-sm">Anyone can join directly</p>
            </button>
            <button
              onClick={() => setPrivacy('private')}
              disabled={!canCreate}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                privacy === 'private'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-purple-900/40 border-white/10 hover:border-purple-400/50'
              }`}
            >
              <Lock className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">Private</h3>
              <p className="text-purple-200 text-sm">Requires approval to join</p>
            </button>
          </div>
        </Card>

        {/* Create Button */}
        <Button
          onClick={handleCreateSpace}
          disabled={!canCreate || !spaceName.trim()}
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Space
        </Button>
      </div>
    </div>
  );
};


export default SpaceCreationPage;

