
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
}

export interface AIModel {
  id: string;
  name: string;
  tier: 'free' | 'premium';
  quotaUsed: number;
  quotaLimit: number;
  apiEndpoint?: string; // TODO: Add actual API endpoints
}

export interface CustomizationSettings {
  tone: 'professional' | 'casual' | 'creative' | 'technical' | 'friendly';
  verbosity: number; // 0-100
  thinkingMode: boolean;
  webSearch: boolean;
  temperature: number; // 0-2
}

export interface VoiceSettings {
  language: string;
  accent: string;
  speed: number;
}

export interface ImageGeneration {
  prompt: string;
  style: string;
  size: string;
  model: string;
}

// API Response Types (TODO: Implement with real APIs)
export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

// Service Interface Types for modular backend structure
export interface ModelService {
  generateResponse(prompt: string, model: AIModel, settings: CustomizationSettings): Promise<APIResponse>;
  validateModel(modelId: string): boolean;
  getModelQuota(modelId: string): Promise<{ used: number; limit: number }>;
}

export interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  summarizeResults(results: SearchResult[]): Promise<string>;
}

export interface ImageService {
  analyzeImage(imageBlob: Blob): Promise<string>;
  generateImage(prompt: string, settings: ImageGeneration): Promise<string>;
}

export interface VoiceService {
  speechToText(audioBlob: Blob, settings: VoiceSettings): Promise<string>;
  textToSpeech(text: string, settings: VoiceSettings): Promise<Blob>;
}
