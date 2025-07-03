
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Brain } from 'lucide-react';
import { Message } from '../types/ego';

interface ChatHistoryProps {
  messages: Message[];
  isThinking?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isThinking }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 border border-white/10 backdrop-blur-xl max-w-md">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Welcome to Ego AI</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your premium AI assistant is ready. Ask questions, upload images, or record voice messages to get started.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-blue-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
                Text Chat
              </Badge>
              <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300 backdrop-blur-sm">
                Deep Thinking
              </Badge>
              <Badge className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 backdrop-blur-sm">
                Web Search
              </Badge>
              <Badge className="bg-teal-500/20 border border-teal-500/30 text-teal-300 backdrop-blur-sm">
                Voice Input
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="h-full overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10">
      <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Avatar className="h-8 w-8 mt-1 border border-white/20 backdrop-blur-sm">
              <AvatarFallback className={
                message.role === 'user' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }>
                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>

            <div className={`flex-1 max-w-[80%] ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-4 rounded-2xl backdrop-blur-sm border ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/30 rounded-br-sm'
                  : 'bg-white/5 text-gray-100 border-white/20 rounded-bl-sm'
              }`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded content"
                    className="max-w-48 max-h-48 rounded-lg mb-2 object-cover border border-white/20"
                  />
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              </div>
              <div className={`text-xs text-gray-400 mt-2 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1 border border-purple-500/30 backdrop-blur-sm">
              <AvatarFallback className="bg-purple-500/20 text-purple-300">
                <Brain className="h-4 w-4 animate-pulse" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="inline-block p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 rounded-bl-sm backdrop-blur-sm">
                <div className="flex items-center gap-3 text-purple-300">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm">Thinking deeply...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};

export default ChatHistory;
