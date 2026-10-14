import React, { useState } from 'react';
import { X, Copy, Mail, QrCode, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ShareSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  spaceName: string;
  inviteLink: string;
}

export const ShareSpaceModal: React.FC<ShareSpaceModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  spaceName,
  inviteLink,
}) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would call API
    console.log('Sending invite to:', email);
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Share Space</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-purple-200 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-purple-200 mb-4">Invite others to <span className="font-semibold text-white">{spaceName}</span></p>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label className="text-purple-200">Invite Link</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1 bg-white/10 border-purple-500/30 text-white"
              />
              <Button
                onClick={handleCopy}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && <p className="text-sm text-green-400">Copied to clipboard!</p>}
          </div>

          {/* Email Share */}
          <div className="space-y-2">
            <Label className="text-purple-200">Share via Email</Label>
            <form onSubmit={handleEmailShare} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </form>
            {emailSent && <p className="text-sm text-green-400">Invite sent!</p>}
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Button
              onClick={() => setShowQR(!showQR)}
              variant="outline"
              className="w-full bg-white/5 border-purple-500/30 text-purple-200 hover:bg-white/10"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Hide' : 'Show'} QR Code
            </Button>
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Scan to join</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
