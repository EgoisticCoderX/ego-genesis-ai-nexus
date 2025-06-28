
import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Image, Mic } from 'lucide-react';

type InputMode = 'text' | 'image' | 'voice';

interface InputModeSelectorProps {
  selectedMode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const modes = [
    { id: 'text' as InputMode, icon: Type, label: 'Text' },
    { id: 'image' as InputMode, icon: Image, label: 'Image' },
    { id: 'voice' as InputMode, icon: Mic, label: 'Voice' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Button
            key={mode.id}
            variant={selectedMode === mode.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 ${
              selectedMode === mode.id
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {mode.label}
          </Button>
        );
      })}
    </div>
  );
};

export default InputModeSelector;
