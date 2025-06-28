
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Sparkles } from 'lucide-react';
import { AIModel } from '../types/ego';

interface ModelSelectorProps {
  selectedModel: AIModel | null;
  onModelChange: (model: AIModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const freeModels: AIModel[] = [
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', tier: 'free', quotaUsed: 0, quotaLimit: 0 },
    { id: 'claude-instant', name: 'Claude Instant', tier: 'free', quotaUsed: 0, quotaLimit: 0 },
    { id: 'llama-7b', name: 'Llama 2 7B', tier: 'free', quotaUsed: 0, quotaLimit: 0 },
    { id: 'mistral-7b', name: 'Mistral 7B', tier: 'free', quotaUsed: 0, quotaLimit: 0 },
    { id: 'falcon-7b', name: 'Falcon 7B', tier: 'free', quotaUsed: 0, quotaLimit: 0 },
  ];

  const premiumModels: AIModel[] = [
    { id: 'gpt-4', name: 'GPT-4 Turbo', tier: 'premium', quotaUsed: 3, quotaLimit: 7 },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', tier: 'premium', quotaUsed: 1, quotaLimit: 7 },
    { id: 'gemini-pro', name: 'Gemini Pro', tier: 'premium', quotaUsed: 5, quotaLimit: 7 },
    { id: 'llama-70b', name: 'Llama 2 70B', tier: 'premium', quotaUsed: 2, quotaLimit: 7 },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', tier: 'premium', quotaUsed: 0, quotaLimit: 7 },
  ];

  const allModels = [...freeModels, ...premiumModels];

  const handleAutoSelect = () => {
    // TODO: Implement smart model selection based on input type and category
    const autoSelected = premiumModels[0]; // Placeholder logic
    onModelChange(autoSelected);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Model Selection</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoSelect}
            className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600"
          >
            <Zap className="h-3 w-3 mr-1" />
            Command
          </Button>
        </div>

        <Select value={selectedModel?.id || ''} onValueChange={(value) => {
          const model = allModels.find(m => m.id === value);
          if (model) onModelChange(model);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <div className="text-xs font-medium text-green-600 mb-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Free Models
              </div>
              {freeModels.map((model) => (
                <SelectItem key={model.id} value={model.id} className="pl-4">
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">Free</Badge>
                  </div>
                </SelectItem>
              ))}
            </div>
            
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-amber-600 mb-2 flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                Premium Models
              </div>
              {premiumModels.map((model) => (
                <SelectItem key={model.id} value={model.id} className="pl-4">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                      <span>{model.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs border-amber-200 text-amber-700">
                        Premium
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {model.quotaUsed}/{model.quotaLimit} messages this week
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>

        {selectedModel && selectedModel.tier === 'premium' && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700">Weekly Quota</span>
              <span className="font-medium text-amber-800">
                {selectedModel.quotaUsed}/{selectedModel.quotaLimit}
              </span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(selectedModel.quotaUsed / selectedModel.quotaLimit) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModelSelector;
