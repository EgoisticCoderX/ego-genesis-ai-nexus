import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, LogIn, LogOut, ChevronLeft, ChevronRight, History, Settings, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ChatHistory from './ChatHistory';
import ResponseTimer from './ResponseTimer';
import ModelSelector from './ModelSelector';
import SmartInputArea from './SmartInputArea';
import QuotaManager from './QuotaManager';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import AIBehaviorPanel from './AIBehaviorPanel';
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Left Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${showLeftSidebar ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
            
            {/* Chat History Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ego AI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            
            {user ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <User className="h-3 w-3 mr-1" />
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}

            {/* Right Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 border-r bg-card/50 ${
          showLeftSidebar ? 'w-80' : 'w-0'
        } overflow-hidden`}>
          <div className="p-4 space-y-4 h-full flex flex-col">
            <ModelSelector 
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Response Timer</h3>
              <ResponseTimer 
                startTime={responseStartTime}
                isActive={isProcessing}
              />
            </Card>

            <div className="flex-1">
              <QuotaManager
                currentUsage={weeklyUsage}
                maxQuota={maxWeeklyQuota}
                resetDate={resetDate}
                onUpgradeClick={handleUpgrade}
              />
            </div>

            {/* Premium/Free Toggle */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Zap className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm font-medium">
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
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
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
        <div className={`transition-all duration-300 border-l bg-card/50 ${
          showRightSidebar ? 'w-80' : 'w-0'
        } overflow-hidden`}>
          <div className="p-4 h-full">
            <AIBehaviorPanel
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