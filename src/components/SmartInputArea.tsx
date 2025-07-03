import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Square, Search, Brain, Volume2, MessageSquare } from 'lucide-react';

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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-2xl shadow-2xl rounded-3xl transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/10 animate-fade-in">
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 pointer-events-none rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5 pointer-events-none rounded-3xl" />
        
        <div className="relative p-4 sm:p-6">
          {/* Input Container with Tab Integration */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
            {/* Mode Tabs - Compact for mobile */}
            <div className="flex items-center gap-1 p-1 bg-black/30 rounded-2xl backdrop-blur-md border border-white/20 order-2 sm:order-1 sm:mb-2 animate-fade-in">
              {(['normal', 'think', 'search'] as const).map((mode) => {
                const Icon = getModeIcon(mode);
                const isActive = activeMode === mode;
                return (
                  <Button
                    key={mode}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModeChange(mode)}
                    className={`h-8 w-8 p-0 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-xl backdrop-blur-sm border border-white/30 animate-bounce-in' 
                        : 'text-gray-400 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-colors duration-300 ${isActive ? getModeColor(mode) : ''}`} />
                  </Button>
                );
              })}
            </div>

            {/* Text Input - Responsive */}
            <div className="flex-1 relative order-1 sm:order-2">
              <Textarea
                value={inputText}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="min-h-[50px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none border-0 bg-black/30 backdrop-blur-md px-4 py-3 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0 rounded-2xl transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
                disabled={isProcessing}
              />
            </div>

            {/* Action Icons - Responsive */}
            <div className="flex items-center gap-2 order-3 sm:mb-2 justify-center sm:justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-10 w-10 p-0 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse' 
                    : 'text-gray-400 hover:text-white hover:bg-white/15'
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
                <div className="h-10 w-10 flex items-center justify-center">
                  <div className="h-4 w-4 bg-teal-400 rounded-full animate-ping shadow-lg shadow-teal-400/50" />
                </div>
              )}
              <Button
                onClick={onSend}
                disabled={!inputText.trim() || isProcessing}
                size="sm"
                className="h-10 w-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-110 animate-glow"
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-teal-500/30 blur-2xl opacity-60 animate-pulse" />
      </Card>

      {/* Active Features Indicator */}
      {(webSearch || thinkingMode || voiceOutput) && (
        <div className="flex gap-2 flex-wrap animate-slide-in-right">
          {webSearch && (
            <Badge className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 backdrop-blur-md rounded-full px-3 py-1 transition-all duration-300 hover:scale-105 animate-bounce-in">
              <Search className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Web Search Active</span>
              <span className="sm:hidden">Search</span>
            </Badge>
          )}
          {thinkingMode && (
            <Badge className="bg-purple-500/20 border border-purple-500/30 text-purple-300 backdrop-blur-md rounded-full px-3 py-1 transition-all duration-300 hover:scale-105 animate-bounce-in">
              <Brain className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Deep Thinking</span>
              <span className="sm:hidden">Think</span>
            </Badge>
          )}
          {voiceOutput && (
            <Badge className="bg-blue-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-md rounded-full px-3 py-1 transition-all duration-300 hover:scale-105 animate-bounce-in">
              <Volume2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Voice Output</span>
              <span className="sm:hidden">Voice</span>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartInputArea;
