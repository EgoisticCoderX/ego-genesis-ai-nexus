
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Brain, Settings } from 'lucide-react';
import { CustomizationSettings } from '../types/ego';
import InfoTooltip from './InfoTooltip';

interface CustomizationPanelProps {
  customization: CustomizationSettings;
  onCustomizationChange: (settings: CustomizationSettings) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  customization, 
  onCustomizationChange 
}) => {
  const updateSetting = (key: keyof CustomizationSettings, value: any) => {
    onCustomizationChange({
      ...customization,
      [key]: value
    });
  };

  return (
    <Card className="p-4 bg-card dark:bg-gray-800 border-border dark:border-gray-700">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-sm">Customization</h3>
          <InfoTooltip content="Customize AI response style, behavior, and advanced features to match your preferences." />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Response Tone</Label>
            <InfoTooltip content="Controls the personality and style of AI responses - from professional business communication to casual conversation." />
          </div>
          <Select 
            value={customization.tone} 
            onValueChange={(value) => updateSetting('tone', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-gray-800 border-border dark:border-gray-700">
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
              <Label className="text-xs font-medium">Verbosity</Label>
              <InfoTooltip content="Adjusts response length - lower values give concise answers, higher values provide detailed explanations." />
            </div>
            <span className="text-xs text-gray-500">{customization.verbosity}%</span>
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

        {/* Thinking Mode */}
        <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium text-purple-800 dark:text-purple-300">Thinking Mode</Label>
              <InfoTooltip content="Enables deeper analysis and reasoning. The AI takes more time to think through complex problems step-by-step before responding." />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Enable deeper reasoning</p>
          </div>
          <Switch
            checked={customization.thinkingMode}
            onCheckedChange={(checked) => updateSetting('thinkingMode', checked)}
          />
        </div>

        {/* Web Search Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Label className="text-xs font-medium">Web Search</Label>
              <p className="text-xs text-gray-500">Include web results</p>
            </div>
            <InfoTooltip content="When enabled, the AI can search the web for current information and include real-time data in responses." />
          </div>
          <Switch
            checked={customization.webSearch}
            onCheckedChange={(checked) => updateSetting('webSearch', checked)}
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium">Creativity</Label>
              <InfoTooltip content="Controls response creativity - lower values are more focused and predictable, higher values are more creative and varied." />
            </div>
            <span className="text-xs text-gray-500">{customization.temperature.toFixed(1)}</span>
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
      </div>
    </Card>
  );
};

export default CustomizationPanel;
