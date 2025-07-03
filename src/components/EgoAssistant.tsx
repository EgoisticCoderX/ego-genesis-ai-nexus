
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, LogIn, LogOut, ChevronLeft, ChevronRight, History, Settings, Crown, Zap, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ChatHistory from './ChatHistory';
import ResponseTimer from './ResponseTimer';
import ModelSelector from './ModelSelector';
import SmartInputArea from './SmartInputArea';
import QuotaManager from './QuotaManager';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import CustomizationPanel from './CustomizationPanel';
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [behavior, setBehavior] = useState('');
  
  // Sidebar states
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  
  // Quota management
  const [weeklyUsage, setWeeklyUsage] = useState(0);
  const maxWeeklyQuota = 7;
  const resetDate = new Date();
  resetDate.setDate(resetDate.getDate() + (7 - resetDate.getDay()));

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Authentication state management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || weeklyUsage >= maxWeeklyQuota) return;

    const timestamp = Date.now();
    setResponseStartTime(timestamp);
    setIsProcessing(true);
    setWeeklyUsage(prev => prev + 1);

    addMessage({
      id: `msg-${timestamp}`,
      role: 'user',
      content: inputText,
      timestamp
    });

    setInputText('');

    if (customization.thinkingMode) {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      setIsThinking(false);
    }

    setTimeout(() => {
      let response = `Response from ${selectedModel?.name || 'default model'}: ${inputText}. ${customization.webSearch ? '[Web search results included]' : ''} ${customization.thinkingMode ? '[Deep analysis performed]' : ''}`;
      
      if (behavior.trim()) {
        response += ` [Responding with ${behavior} personality]`;
      }
      
      addMessage({
        id: `msg-${timestamp}-response`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      });

      if (voiceOutput) {
        console.log('🔊 Voice output would play here:', response);
      }

      setIsProcessing(false);
      setResponseStartTime(null);
    }, 1000 + Math.random() * 2000);
  };

  const handleVoiceInput = (text: string) => {
    setInputText(prev => prev + ' ' + text);
  };

  const handleAuthSuccess = (userData: SupabaseUser) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleUpgrade = () => {
    alert('Upgrade functionality would redirect to payment page');
  };

  if (weeklyUsage >= maxWeeklyQuota) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col overflow-hidden">
      {/* Premium Header */}
      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10" />
        <div className="relative flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Left Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${showLeftSidebar ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
            
            {/* Chat History Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className={`flex items-center gap-2 px-3 h-9 transition-all duration-200 ${
                showChatHistory 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <History className="h-4 w-4" />
              <span className="text-sm">Chat</span>
            </Button>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              Ego AI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            
            {user ? (
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                  <User className="h-3 w-3 mr-1" />
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAuthModalOpen(true)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}

            {/* Right Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`h-9 w-9 p-0 transition-all duration-200 ${
                showRightSidebar 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 ${
          showLeftSidebar ? 'w-80' : 'w-0'
        } overflow-hidden`}>
          <div className="w-80 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 p-4 space-y-4 flex flex-col">
            {/* Model Selector */}
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            
            {/* Response Timer */}
            <Card className="p-4 bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="font-semibold mb-3 text-sm text-white">Response Timer</h3>
              <ResponseTimer 
                startTime={responseStartTime}
                isActive={isProcessing}
              />
            </Card>

            {/* Quota Manager */}
            <div className="flex-1">
              <QuotaManager
                currentUsage={weeklyUsage}
                maxQuota={maxWeeklyQuota}
                resetDate={resetDate}
                onUpgradeClick={handleUpgrade}
              />
            </div>

            {/* Premium/Free Toggle */}
            <Card className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <Crown className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Zap className="h-4 w-4 text-blue-400" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {isPremium ? 'Premium' : 'Free'} AI
                  </span>
                </div>
                <Switch
                  checked={isPremium}
                  onCheckedChange={setIsPremium}
                  className="data-[state=checked]:bg-yellow-600"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
            {/* Chat History */}
            {showChatHistory && (
              <div className="flex-1 min-h-0">
                <ChatHistory 
                  messages={messages}
                  isThinking={isThinking}
                />
              </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0">
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

        {/* Right Sidebar */}
        <div className={`transition-all duration-300 ${
          showRightSidebar ? 'w-80' : 'w-0'
        } overflow-hidden`}>
          <div className="w-80 h-full bg-black/20 backdrop-blur-xl border-l border-white/10 p-4">
            <CustomizationPanel
              customization={customization}
              onCustomizationChange={updateCustomization}
              voiceOutput={voiceOutput}
              onVoiceOutputToggle={setVoiceOutput}
              behavior={behavior}
              onBehaviorChange={setBehavior}
            />
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default EgoAssistant;
