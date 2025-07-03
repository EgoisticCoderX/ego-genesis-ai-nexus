import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface AIBehaviorPanelProps {
  voiceOutput: boolean;
  onVoiceOutputToggle: (enabled: boolean) => void;
  behavior: string;
  onBehaviorChange: (behavior: string) => void;
}

const AIBehaviorPanel: React.FC<AIBehaviorPanelProps> = ({
  voiceOutput,
  onVoiceOutputToggle,
  behavior,
  onBehaviorChange
}) => {
  return (
    <Card className="p-4 bg-card border-border h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">AI Behavior</h3>
          <InfoTooltip content="Customize how the AI responds and behaves during conversations." />
        </div>

        {/* Behavior Description */}
        <div className="space-y-2">
          <Label htmlFor="behavior" className="text-xs text-muted-foreground">
            Personality & Style
          </Label>
          <Textarea
            id="behavior"
            value={behavior}
            onChange={(e) => onBehaviorChange(e.target.value)}
            placeholder="Describe how you want the AI to behave... (e.g., be funny, talk like a friend, be professional, etc.)"
            className="min-h-[100px] text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Examples: "Be funny and casual", "Act like a professional assistant", "Talk like a friend"
          </p>
        </div>

        {/* Voice Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {voiceOutput ? (
                <Volume2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <Label className="text-sm">Voice Output</Label>
              <InfoTooltip content="Enable text-to-speech for AI responses" />
            </div>
            <Switch
              checked={voiceOutput}
              onCheckedChange={onVoiceOutputToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>

        {/* Active Behavior Indicator */}
        {behavior.trim() && (
          <div className="mt-4">
            <Badge variant="secondary" className="text-xs">
              Custom Behavior Active
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIBehaviorPanel;