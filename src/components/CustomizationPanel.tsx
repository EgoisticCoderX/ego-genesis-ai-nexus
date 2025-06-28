
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Brain, Settings } from 'lucide-react';
import { CustomizationSettings } from '../types/ego';

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
    <Card className="p-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-green-600" />
          <h3 className="font-semibold text-sm">Customization</h3>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Response Tone</Label>
          <Select 
            value={customization.tone} 
            onValueChange={(value) => updateSetting('tone', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            <Label className="text-xs font-medium">Verbosity</Label>
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
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <Brain className="h-4 w-4 text-purple-600" />
          <div className="flex-1">
            <Label className="text-xs font-medium text-purple-800">Thinking Mode</Label>
            <p className="text-xs text-purple-600 mt-1">Enable deeper reasoning</p>
          </div>
          <Switch
            checked={customization.thinkingMode}
            onCheckedChange={(checked) => updateSetting('thinkingMode', checked)}
          />
        </div>

        {/* Web Search Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Web Search</Label>
            <p className="text-xs text-gray-500">Include web results</p>
          </div>
          <Switch
            checked={customization.webSearch}
            onCheckedChange={(checked) => updateSetting('webSearch', checked)}
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-medium">Creativity</Label>
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
