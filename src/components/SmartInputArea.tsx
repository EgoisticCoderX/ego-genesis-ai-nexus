
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Square, Search, Brain, Volume2, Image, MapPin, Paperclip, Globe, MessageSquare } from 'lucide-react';

interface SmartInputAreaProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  isProcessing: boolean;
  webSearch: boolean;
  onWebSearchToggle: (enabled: boolean) => void;
  thinkingMode: boolean;
  onThinkingModeToggle: (enabled: boolean) => void;
  voiceOutput: boolean;
  onVoiceOutputToggle: (enabled: boolean) => void;
  onVoiceInput: (text: string) => void;
}

const SmartInputArea: React.FC<SmartInputAreaProps> = ({
  inputText,
  onTextChange,
  onSend,
  isProcessing,
  webSearch,
  onWebSearchToggle,
  thinkingMode,
  onThinkingModeToggle,
  voiceOutput,
  onVoiceOutputToggle,
  onVoiceInput
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState<'normal' | 'think' | 'search'>('normal');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setTimeout(() => {
          onVoiceInput("Voice input detected - this is simulated transcription.");
        }, 1000);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleModeChange = (mode: 'normal' | 'think' | 'search') => {
    setActiveMode(mode);
    onThinkingModeToggle(mode === 'think');
    onWebSearchToggle(mode === 'search');
  };

  const getModeIcon = (mode: 'normal' | 'think' | 'search') => {
    switch (mode) {
      case 'normal': return MessageSquare;
      case 'think': return Brain;
      case 'search': return Search;
    }
  };

  const getModeColor = (mode: 'normal' | 'think' | 'search') => {
    switch (mode) {
      case 'normal': return 'text-blue-500';
      case 'think': return 'text-purple-500';
      case 'search': return 'text-emerald-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Premium Glass Input Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl shadow-2xl">
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
        
        <div className="relative p-6">
          {/* Mode Tabs - Inside the textbox */}
          <div className="flex items-center gap-1 mb-4 p-1 bg-black/20 rounded-xl backdrop-blur-sm border border-white/10">
            {(['normal', 'think', 'search'] as const).map((mode) => {
              const Icon = getModeIcon(mode);
              const isActive = activeMode === mode;
              return (
                <Button
                  key={mode}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleModeChange(mode)}
                  className={`flex-1 h-9 gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? getModeColor(mode) : ''}`} />
                  <span className="text-xs font-medium capitalize">{mode}</span>
                </Button>
              );
            })}
          </div>

          {/* Input Container */}
          <div className="flex items-end gap-4">
            {/* Left Icons */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                disabled={isProcessing}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                disabled={isProcessing}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                value={inputText}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="min-h-[60px] max-h-[200px] resize-none border-0 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-0 rounded-xl"
                disabled={isProcessing}
              />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                disabled={isProcessing}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                disabled={isProcessing}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-9 w-9 p-0 transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              {isRecording && (
                <div className="h-9 w-9 flex items-center justify-center">
                  <div className="h-4 w-4 bg-teal-400 rounded animate-pulse shadow-lg shadow-teal-400/50" />
                </div>
              )}
              <Button
                onClick={onSend}
                disabled={!inputText.trim() || isProcessing}
                size="sm"
                className="h-9 w-9 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 shadow-lg transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Premium glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 blur-xl opacity-50" />
      </Card>

      {/* Active Features Indicator */}
      {(webSearch || thinkingMode || voiceOutput) && (
        <div className="flex gap-2 flex-wrap animate-fade-in">
          {webSearch && (
            <Badge className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 backdrop-blur-sm">
              <Search className="h-3 w-3 mr-1" />
              Web Search Active
            </Badge>
          )}
          {thinkingMode && (
            <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300 backdrop-blur-sm">
              <Brain className="h-3 w-3 mr-1" />
              Deep Thinking
            </Badge>
          )}
          {voiceOutput && (
            <Badge className="bg-blue-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
              <Volume2 className="h-3 w-3 mr-1" />
              Voice Output
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartInputArea;
