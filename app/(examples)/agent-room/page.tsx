'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import RoomJoinFlow from './components/room-join-flow';
import ConversationRoom from './components/conversation-room';

export default function AgentRoomPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [roomId] = useState(() => 'agent-room-' + Date.now());
  const conversation = useConversation();

  const handleJoinRoom = (name: string) => {
    setUserName(name);
  };

  const handleLeaveRoom = () => {
    conversation.endSession();
    setUserName(null);
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
          onLeave={handleLeaveRoom}
          agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        />
      )}
    </div>
  );
}
