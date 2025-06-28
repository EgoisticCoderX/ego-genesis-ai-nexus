
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, LogIn, LogOut } from 'lucide-react';
import ChatHistory from './ChatHistory';
import ResponseTimer from './ResponseTimer';
import ModelSelector from './ModelSelector';
import CustomizationPanel from './CustomizationPanel';
import SmartInputArea from './SmartInputArea';
import QuotaManager from './QuotaManager';
import ThemeToggle from './ThemeToggle';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [voiceOutput, setVoiceOutput] = useState(false);
  
  // Quota management
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const maxWeeklyQuota = 7;
  const resetDate = new Date();
  resetDate.setDate(resetDate.getDate() + (7 - resetDate.getDay())); // Next Sunday

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSend = async () => {
    if (!inputText.trim() || weeklyUsage >= maxWeeklyQuota) return;

    const timestamp = Date.now();
    setResponseStartTime(timestamp);
    setIsProcessing(true);

    // Increment usage
    setWeeklyUsage(prev => prev + 1);

    // Add user message
    addMessage({
      id: `msg-${timestamp}`,
      role: 'user',
      content: inputText,
      timestamp
    });

    // Clear input
    setInputText('');

    // Simulate AI thinking if enabled
    if (customization.thinkingMode) {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      setIsThinking(false);
    }

    // Simulate AI response
    setTimeout(() => {
      const response = `Response from ${selectedModel?.name || 'default model'}: ${inputText}. ${customization.webSearch ? '[Web search results included]' : ''} ${customization.thinkingMode ? '[Deep analysis performed]' : ''}`;
      
      addMessage({
        id: `msg-${timestamp}-response`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      });

      // Voice output simulation
      if (voiceOutput) {
        // Simulate text-to-speech
        console.log('🔊 Voice output would play here:', response);
      }

      setIsProcessing(false);
      setResponseStartTime(null);
    }, 1000 + Math.random() * 2000);
  };

  const handleVoiceInput = (text: string) => {
    setInputText(prev => prev + ' ' + text);
  };

  const handleLogin = () => {
    // Simulate login - in real app, integrate with Supabase
    setIsLoggedIn(true);
    setUsername('Demo User');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleUpgrade = () => {
    alert('Upgrade functionality would redirect to payment page');
  };

  if (weeklyUsage >= maxWeeklyQuota) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'
      }`}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2 animate-fade-in">
              Ego AI Assistant
            </h1>
          </div>
          
          <QuotaManager
            currentUsage={weeklyUsage}
            maxQuota={maxWeeklyQuota}
            resetDate={resetDate}
            onUpgradeClick={handleUpgrade}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
              Ego AI Assistant
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
              Multimodal AI with dynamic model selection
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  <User className="h-3 w-3 mr-1" />
                  {username}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogin}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4 animate-slide-in-right">
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            
            <CustomizationPanel 
              customization={customization}
              onCustomizationChange={updateCustomization}
            />

            <Card className={`p-4 transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-semibold mb-3 text-sm">Response Timer</h3>
              <ResponseTimer 
                startTime={responseStartTime}
                isActive={isProcessing}
              />
            </Card>

            <QuotaManager
              currentUsage={weeklyUsage}
              maxQuota={maxWeeklyQuota}
              resetDate={resetDate}
              onUpgradeClick={handleUpgrade}
            />
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 space-y-4 animate-fade-in">
            {/* Chat History */}
            <ChatHistory 
              messages={messages}
              isThinking={isThinking}
            />

            {/* Smart Input Area */}
            <SmartInputArea
              inputText={inputText}
              onTextChange={setInputText}
              onSend={handleSend}
              isProcessing={isProcessing}
              webSearch={customization.webSearch}
              onWebSearchToggle={(enabled) => updateCustomization({...customization, webSearch: enabled})}
              thinkingMode={customization.thinkingMode}
              onThinkingModeToggle={(enabled) => updateCustomization({...customization, thinkingMode: enabled})}
              voiceOutput={voiceOutput}
              onVoiceOutputToggle={setVoiceOutput}
              onVoiceInput={handleVoiceInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgoAssistant;
