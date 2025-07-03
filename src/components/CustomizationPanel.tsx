
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Settings, Volume2, VolumeX } from 'lucide-react';
import { CustomizationSettings } from '../types/ego';
import InfoTooltip from './InfoTooltip';

interface CustomizationPanelProps {
  customization: CustomizationSettings;
  onCustomizationChange: (settings: CustomizationSettings) => void;
  voiceOutput: boolean;
  onVoiceOutputToggle: (enabled: boolean) => void;
  behavior: string;
  onBehaviorChange: (behavior: string) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  customization, 
  onCustomizationChange,
  voiceOutput,
  onVoiceOutputToggle,
  behavior,
  onBehaviorChange
}) => {
  const updateSetting = (key: keyof CustomizationSettings, value: any) => {
    onCustomizationChange({
      ...customization,
      [key]: value
    });
  };

  return (
    <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-purple-400" />
          <h3 className="font-semibold text-sm text-white">AI Customization</h3>
          <InfoTooltip content="Customize AI response style, behavior, and advanced features to match your preferences." />
        </div>

        {/* AI Behavior Description */}
        <div className="space-y-2">
          <Label htmlFor="behavior" className="text-xs text-gray-300">
            AI Personality & Style
          </Label>
          <Textarea
            id="behavior"
            value={behavior}
            onChange={(e) => onBehaviorChange(e.target.value)}
            placeholder="Describe how you want the AI to behave... (e.g., be funny, talk like a friend, be professional, etc.)"
            className="min-h-[80px] text-sm resize-none bg-black/20 border border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 backdrop-blur-sm"
          />
          <p className="text-xs text-gray-400">
            Examples: "Be funny and casual", "Act like a professional assistant", "Talk like a friend"
          </p>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium text-white">Response Tone</Label>
            <InfoTooltip content="Controls the personality and style of AI responses - from professional business communication to casual conversation." />
          </div>
          <Select 
            value={customization.tone} 
            onValueChange={(value) => updateSetting('tone', value)}
          >
            <SelectTrigger className="h-8 bg-black/20 border-white/20 text-white backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 border-white/20 backdrop-blur-xl text-white">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verbosity Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium text-white">Verbosity</Label>
              <InfoTooltip content="Adjusts response length - lower values give concise answers, higher values provide detailed explanations." />
            </div>
            <span className="text-xs text-purple-300">{customization.verbosity}%</span>
          </div>
          <Slider
            value={[customization.verbosity]}
            onValueChange={(values) => updateSetting('verbosity', values[0])}
            max={100}
            min={10}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Concise</span>
            <span>Detailed</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium text-white">Creativity</Label>
              <InfoTooltip content="Controls response creativity - lower values are more focused and predictable, higher values are more creative and varied." />
            </div>
            <span className="text-xs text-blue-300">{customization.temperature.toFixed(1)}</span>
          </div>
          <Slider
            value={[customization.temperature]}
            onValueChange={(values) => updateSetting('temperature', values[0])}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>


        {/* Voice Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {voiceOutput ? (
                <Volume2 className="h-4 w-4 text-blue-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-400" />
              )}
              <div>
                <Label className="text-sm text-blue-300">Voice Output</Label>
                <p className="text-xs text-blue-400">Text-to-speech responses</p>
              </div>
              <InfoTooltip content="Enable text-to-speech for AI responses" />
            </div>
            <Switch
              checked={voiceOutput}
              onCheckedChange={onVoiceOutputToggle}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomizationPanel;
