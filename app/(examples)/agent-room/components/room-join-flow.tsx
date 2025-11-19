'use client';

import { useState } from 'react';
import { Mic, Users } from 'lucide-react';

interface RoomJoinFlowProps {
  onJoin: (name: string) => void;
}

export default function RoomJoinFlow({ onJoin }: RoomJoinFlowProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      onJoin(name);
    } catch (error) {
      console.error('Microphone access denied:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-6">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Room</h1>
            <p className="text-slate-400">Connect with an AI agent for a conversation</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              {isLoading ? 'Connecting...' : 'Join Room'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-sm text-slate-300">
              💡 <strong>Tip:</strong> Make sure your microphone is enabled for the best experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
