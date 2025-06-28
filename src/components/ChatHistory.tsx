
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
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Welcome to Ego AI</h3>
            <p className="text-green-600 max-w-md mx-auto">
              Your multimodal AI assistant is ready. Ask questions, upload images, or record voice messages to get started.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="border-green-200 text-green-700">
              Text Chat
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Image Analysis
            </Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              Voice Input
            </Badge>
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              Web Search
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-h-[600px] overflow-y-auto">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className={
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-green-100 text-green-600'
              }>
                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>

            <div className={`flex-1 max-w-[80%] ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded content"
                    className="max-w-48 max-h-48 rounded mb-2 object-cover"
                  />
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                <Brain className="h-4 w-4 animate-pulse" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-purple-50 border border-purple-200 rounded-bl-sm">
                <div className="flex items-center gap-2 text-purple-700">
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
