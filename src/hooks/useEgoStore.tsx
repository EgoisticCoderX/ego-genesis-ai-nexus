
import { create } from 'zustand';
import { Message, AIModel, CustomizationSettings } from '../types/ego';

type InputMode = 'text' | 'image' | 'voice';

interface EgoStore {
  messages: Message[];
  selectedModel: AIModel | null;
  inputMode: InputMode;
  customization: CustomizationSettings;
  isThinking: boolean;
  
  addMessage: (message: Message) => void;
  setSelectedModel: (model: AIModel) => void;
  setInputMode: (mode: InputMode) => void;
  updateCustomization: (settings: CustomizationSettings) => void;
  setIsThinking: (thinking: boolean) => void;
  clearHistory: () => void;
}

const defaultCustomization: CustomizationSettings = {
  tone: 'professional',
  verbosity: 50,
  thinkingMode: false,
  webSearch: false,
  temperature: 0.7,
};

export const useEgoStore = create<EgoStore>((set) => ({
  messages: [],
  selectedModel: null,
  inputMode: 'text',
  customization: defaultCustomization,
  isThinking: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setSelectedModel: (model) =>
    set({ selectedModel: model }),

  setInputMode: (mode) =>
    set({ inputMode: mode }),

  updateCustomization: (settings) =>
    set({ customization: settings }),

  setIsThinking: (thinking) =>
    set({ isThinking: thinking }),

  clearHistory: () =>
    set({ messages: [] }),
}));

// Note: Using zustand without persist for now - can be added later
// TODO: Add persistence layer for chat history and settings
