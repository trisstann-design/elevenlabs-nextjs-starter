'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import RoomJoinFlow from './components/room-join-flow';
import ConversationRoom from './components/conversation-room';

export default function AgentRoomPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [roomId] = useState(() => 'agent-room-' + Date.now());
  const [messages, setMessages] = useState<Array<{ source: string; message: string }>>([]);
  const [micMuted, setMicMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // ✅ Σωστή χρήση του useConversation με callbacks
  const conversation = useConversation({
    micMuted,
    volume,
    onMessage: (props) => {
      const { message, source } = props;
      setMessages(prev => [...prev, { message, source }]);
    },
    onConnect: () => {
      console.log('Connected to agent');
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    }
  });

  const handleJoinRoom = (name: string) => {
    setUserName(name);
  };

  const handleLeaveRoom = () => {
    conversation.endSession();
    setUserName(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {!userName ? (
        <RoomJoinFlow onJoin={handleJoinRoom} />
      ) : (
        <ConversationRoom
          userName={userName}
          roomId={roomId}
          conversation={conversation}
          messages={messages}
          micMuted={micMuted}
          setMicMuted={setMicMuted}
          volume={volume}
          setVolume={setVolume}
          onLeave={handleLeaveRoom}
          agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        />
      )}
    </div>
  );
}
