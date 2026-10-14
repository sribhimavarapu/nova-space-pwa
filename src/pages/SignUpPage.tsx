import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-6">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="text-purple-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">Create Account</h1>
              <p className="text-purple-200">Join the Nova Space community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-200">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  Sign Up
                  <Sparkles className="w-5 h-5" />
                </span>
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-purple-300">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline" className="bg-white/5 border-purple-500/30 text-purple-200 hover:bg-white/10">
                  Google
                </Button>
                <Button variant="outline" className="bg-white/5 border-purple-500/30 text-purple-200 hover:bg-white/10">
                  Discord
                </Button>
              </div>
            </div>

            <p className="text-center text-purple-300 mt-8">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign In
              </button>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
