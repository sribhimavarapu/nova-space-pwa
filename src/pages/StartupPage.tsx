import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui';

const StartupPage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center space-y-8 max-w-4xl">
          {/* Logo/Icon with glow effect */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                <Rocket className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title with gradient text */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-purple-100 to-pink-200 drop-shadow-2xl">
              Nova Space
            </h1>
            <p className="text-2xl md:text-3xl text-purple-200 font-light tracking-wide">
              Your Virtual Universe Awaits
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Connect, collaborate, and create in immersive 3D spaces. 
            <br className="hidden md:block" />
            Experience the future of virtual interaction.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 text-lg rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="group text-center space-y-3 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300">Immersive Spaces</p>
            </div>
            <div className="group text-center space-y-3 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300">Social Connect</p>
            </div>
            <div className="group text-center space-y-3 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300">Custom Avatars</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupPage;
