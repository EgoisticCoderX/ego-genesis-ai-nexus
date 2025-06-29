import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, MicOff, Square, Search, Brain, Volume2, VolumeX } from 'lucide-react';
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
  const [showControls, setShowControls] = useState(false);
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
        // Simulate voice to text
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

  return (
    <Card className="p-6 shadow-2xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 hover:shadow-3xl animate-fade-in">
      <div className="space-y-4">
        {/* Smart Controls Slider */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200"
            >
              Smart Controls {showControls ? '▲' : '▼'}
            </Button>
            <InfoTooltip content="Configure advanced AI features including web search, deep thinking mode, and voice output settings to enhance your AI interaction experience." />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-pulse bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              AI Ready
            </Badge>
          </div>
        </div>

        {/* Expandable Controls */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showControls ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Web Search Toggle */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="text-sm font-medium">Web Search</span>
                  <InfoTooltip content="Enable real-time web search to include current information, news, and recent data in AI responses for more accurate and up-to-date answers." className="ml-1" />
                </div>
              </div>
              <Switch
                checked={webSearch}
                onCheckedChange={onWebSearchToggle}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Thinking Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="text-sm font-medium">Think Mode</span>
                  <InfoTooltip content="Activates deeper reasoning process where the AI takes extra time to analyze complex problems step-by-step, providing more thoughtful and detailed responses." className="ml-1" />
                </div>
              </div>
              <Switch
                checked={thinkingMode}
                onCheckedChange={onThinkingModeToggle}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {/* Voice Output Toggle */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                {voiceOutput ? (
                  <Volume2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <span className="text-sm font-medium">Voice Output</span>
                  <InfoTooltip content="Enable text-to-speech functionality for AI responses. The AI will read answers aloud using voice synthesis for hands-free interaction." className="ml-1" />
                </div>
              </div>
              <Switch
                checked={voiceOutput}
                onCheckedChange={onVoiceOutputToggle}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Ego anything... Press Enter to send or use voice input"
            className="min-h-[120px] pr-20 pb-16 resize-none border-2 border-gray-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 text-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            disabled={isProcessing}
          />
          
          {/* Voice Input Button */}
          <div className="absolute bottom-3 right-16">
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`transition-all duration-300 hover:scale-110 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-200 dark:shadow-red-900' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-purple-900'
              }`}
              size="sm"
            >
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Send Button */}
          <div className="absolute bottom-3 right-3">
            <Button
              onClick={onSend}
              disabled={!inputText.trim() || isProcessing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-110 shadow-lg shadow-green-200 dark:shadow-green-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              size="sm"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Active Features Indicator */}
        {(webSearch || thinkingMode || voiceOutput) && (
          <div className="flex gap-2 flex-wrap animate-fade-in">
            {webSearch && (
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 animate-pulse">
                <Search className="h-3 w-3 mr-1" />
                Web Search Active
              </Badge>
            )}
            {thinkingMode && (
              <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 animate-pulse">
                <Brain className="h-3 w-3 mr-1" />
                Deep Thinking
              </Badge>
            )}
            {voiceOutput && (
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 animate-pulse">
                <Volume2 className="h-3 w-3 mr-1" />
                Voice Output
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartInputArea;
