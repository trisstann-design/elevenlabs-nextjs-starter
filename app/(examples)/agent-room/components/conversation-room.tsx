'use client';

import { useEffect, useState } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
interface ConversationRoomProps {
  userName: string;
  roomId: string;
  conversation: object;  agentId?: string;
    onLeave?: () => void;
}

export default function ConversationRoom({
  userName,
  roomId,
  conversation,
  onLeave,
  agentId,
}: ConversationRoomProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  const { status, isSpeaking, startSession, endSession, messages } = conversation;

  useEffect(() => {
    const start = async () => {
      if (status === 'disconnected' && agentId) {
        try {
          await startSession({
            agentId,
            connectionType: 'webrtc',
            userId: userName,
                              micMuted: isMicMuted,
                              volume: isSpeakerMuted ? 0 : 1,
          });
        } catch (error) {
          console.error('Failed to start session:', error);
        }
      }
    };

    start();
  }, [agentId, startSession, status, userName, isMicMuted, isSpeakerMuted]);

  const handleEndCall = async () => {
    await endSession();
    onLeave();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {status === 'connected' ? '✓ Connected' : 'Connecting...'}
        </h2>
        <p className="text-slate-400">Room ID: {roomId}</p>
      </div>

      <div className="w-full max-w-2xl bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-700 mb-8">
        <div className="flex items-center justify-between mb-8 p-4 bg-slate-700/50 rounded-lg">
          <div>
            <p className="text-slate-400 text-sm">You</p>
            <p className="text-white font-semibold text-lg">{userName}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`} />
        </div>

        <div className="flex items-center justify-between mb-8 p-4 bg-slate-700/50 rounded-lg">
          <div>
            <p className="text-slate-400 text-sm">Agent</p>
            <p className="text-white font-semibold text-lg">ElevenLabs AI</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
        </div>

        <div className="bg-slate-900 rounded-lg p-4 mb-8 h-48 overflow-y-auto border border-slate-600">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-center mt-20">Waiting for response...</p>
          ) : (
            <div className="space-y-3">
              {messages
                .filter((msg) => msg.source === 'user' || msg.source === 'agent')
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-3 rounded-lg ${
                      msg.source === 'user'
                        ? 'bg-purple-600/30 text-purple-200 ml-8'
                        : 'bg-blue-600/30 text-blue-200 mr-8'
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-4 rounded-full transition-all ${
              isMicMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {isMicMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className={`p-4 rounded-full transition-all ${
              isSpeakerMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {isSpeakerMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      <p className="text-slate-400 text-sm">
        Status: <span className="text-white font-semibold">{status}</span>
      </p>
    </div>
  );
}
