import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Square, Search, Brain, Volume2, VolumeX, Image, MapPin, Paperclip, Globe } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

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
  const [mode, setMode] = useState(0); // 0: Normal, 1: Think, 2: Web Search
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const modes = ['Normal', 'Think', 'Web Search'];

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

  const handleModeChange = (value: string) => {
    const newMode = value === 'normal' ? 0 : value === 'think' ? 1 : 2;
    setMode(newMode);
    
    // Update corresponding toggles
    onThinkingModeToggle(newMode === 1);
    onWebSearchToggle(newMode === 2);
  };

  const getModeValue = () => {
    return mode === 0 ? 'normal' : mode === 1 ? 'think' : 'search';
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <Card className="p-3 bg-card border-border">
        <Tabs value={getModeValue()} onValueChange={handleModeChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="normal" className="text-xs">Normal</TabsTrigger>
            <TabsTrigger value="think" className="text-xs">Think</TabsTrigger>
            <TabsTrigger value="search" className="text-xs">Web Search</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Main Input Card */}
      <Card className="border-border bg-card">
        <div className="relative">
          {/* Input Container */}
          <div className="flex items-end gap-2 p-4">
            {/* Left Icons */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isProcessing}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isProcessing}
              >
                <Image className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isProcessing}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                value={inputText}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="min-h-[50px] max-h-[200px] resize-none border-0 bg-transparent px-0 py-2 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isProcessing}
              />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isProcessing}
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isProcessing}
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-8 w-8 p-0 ${
                  isRecording 
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                    : 'hover:bg-accent'
                }`}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              {isRecording && (
                <div className="h-8 w-8 flex items-center justify-center">
                  <div className="h-4 w-4 bg-teal-500 rounded animate-pulse" />
                </div>
              )}
              <Button
                onClick={onSend}
                disabled={!inputText.trim() || isProcessing}
                size="sm"
                className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Features Indicator */}
      {(webSearch || thinkingMode || voiceOutput) && (
        <div className="flex gap-2 flex-wrap animate-fade-in">
          {webSearch && (
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              <Search className="h-3 w-3 mr-1" />
              Web Search Active
            </Badge>
          )}
          {thinkingMode && (
            <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              <Brain className="h-3 w-3 mr-1" />
              Deep Thinking
            </Badge>
          )}
          {voiceOutput && (
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
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