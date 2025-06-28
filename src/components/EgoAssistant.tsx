
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mic, Upload, Send, Zap, Search, Image as ImageIcon, Clock, Brain } from 'lucide-react';
import ChatHistory from './ChatHistory';
import ResponseTimer from './ResponseTimer';
import ModelSelector from './ModelSelector';
import InputModeSelector from './InputModeSelector';
import CustomizationPanel from './CustomizationPanel';
import ImageUpload from './ImageUpload';
import VoiceRecorder from './VoiceRecorder';
import { useEgoStore } from '../hooks/useEgoStore';

const EgoAssistant = () => {
  const {
    messages,
    selectedModel,
    inputMode,
    customization,
    isThinking,
    addMessage,
    setSelectedModel,
    setInputMode,
    updateCustomization,
    setIsThinking
  } = useEgoStore();

  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!inputText.trim() && !uploadedImage) return;

    const timestamp = Date.now();
    setResponseStartTime(timestamp);
    setIsProcessing(true);

    // Add user message
    addMessage({
      id: `msg-${timestamp}`,
      role: 'user',
      content: inputText,
      image: uploadedImage ? URL.createObjectURL(uploadedImage) : undefined,
      timestamp
    });

    // Clear inputs
    setInputText('');
    setUploadedImage(null);

    // Simulate AI thinking if enabled
    if (customization.thinkingMode) {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      setIsThinking(false);
    }

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        id: `msg-${timestamp}-response`,
        role: 'assistant',
        content: `This is a simulated response using ${selectedModel?.name || 'default model'}. The actual AI integration will be implemented later with the selected model's API.`,
        timestamp: Date.now()
      });
      setIsProcessing(false);
      setResponseStartTime(null);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
            Ego AI Assistant
          </h1>
          <p className="text-gray-600">Multimodal AI with dynamic model selection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            
            <CustomizationPanel 
              customization={customization}
              onCustomizationChange={updateCustomization}
            />

            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Response Timer</h3>
              <ResponseTimer 
                startTime={responseStartTime}
                isActive={isProcessing}
              />
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Chat History */}
            <ChatHistory 
              messages={messages}
              isThinking={isThinking}
            />

            {/* Input Area */}
            <Card className="p-6 shadow-lg border-green-100">
              <div className="space-y-4">
                {/* Input Mode Selector */}
                <InputModeSelector 
                  selectedMode={inputMode}
                  onModeChange={setInputMode}
                />

                {/* Main Input Area */}
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Ego anything... (multimodal input supported)"
                    className="min-h-[100px] pr-16 resize-none border-gray-200 focus:border-green-400 focus:ring-green-400"
                    disabled={isProcessing}
                  />
                  
                  {/* Send Button */}
                  <Button
                    onClick={handleSend}
                    disabled={(!inputText.trim() && !uploadedImage) || isProcessing}
                    className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Multimodal Input Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <ImageUpload 
                    onImageUpload={setUploadedImage}
                    uploadedImage={uploadedImage}
                  />
                  
                  <VoiceRecorder 
                    isRecording={isRecording}
                    onRecordingChange={setIsRecording}
                    onTranscription={(text) => setInputText(prev => prev + ' ' + text)}
                  />

                  <div className="flex-1" />

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Web Search
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Image
                  </Button>
                </div>

                {/* Uploaded Image Preview */}
                {uploadedImage && (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded"
                      className="max-w-32 max-h-32 rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => setUploadedImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgoAssistant;
