import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';

const AvatarCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');

  const avatarStyles = [
    { id: 0, emoji: '👨', name: 'Classic' },
    { id: 1, emoji: '👩', name: 'Professional' },
    { id: 2, emoji: '🧑', name: 'Casual' },
    { id: 3, emoji: '👨‍🚀', name: 'Astronaut' },
    { id: 4, emoji: '👩‍💻', name: 'Developer' },
    { id: 5, emoji: '🧙', name: 'Wizard' },
  ];

  const colors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  ];

  const handleSave = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <header className="relative z-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="text-purple-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">Create Your Avatar</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 space-y-12">
        <div className="flex justify-center">
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center text-8xl shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: selectedColor }}
          >
            {avatarStyles[selectedAvatar].emoji}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Choose Style</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {avatarStyles.map((style) => (
              <Card
                key={style.id}
                onClick={() => setSelectedAvatar(style.id)}
                className={`relative cursor-pointer bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border rounded-xl p-4 hover:scale-105 transition-all duration-300 ${
                  selectedAvatar === style.id
                    ? 'border-purple-400 ring-2 ring-purple-400 shadow-lg shadow-purple-500/50'
                    : 'border-purple-500/30'
                }`}
              >
                {selectedAvatar === style.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="text-4xl mb-2">{style.emoji}</div>
                <p className="text-xs text-purple-200">{style.name}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Choose Color</h2>
          <div className="grid grid-cols-6 gap-4">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative w-full aspect-square rounded-xl transition-all duration-300 hover:scale-110 ${
                  selectedColor === color ? 'ring-4 ring-white shadow-xl' : 'shadow-lg'
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <Check className="absolute inset-0 m-auto w-6 h-6 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Accessories</h2>
          <div className="grid grid-cols-4 gap-4">
            {['👓', '🎩', '👑', '🎭'].map((accessory, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 hover:bg-white/10 hover:scale-105 transition-all duration-300 text-4xl cursor-pointer text-center"
              >
                {accessory}
              </Card>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <span className="flex items-center gap-2">
            Save Avatar
            <Sparkles className="w-5 h-5" />
          </span>
        </Button>
      </main>
    </div>
  );
};

export default AvatarCreationPage;
