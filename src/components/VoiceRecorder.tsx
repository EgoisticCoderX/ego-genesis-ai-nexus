
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onTranscription: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  isRecording, 
  onRecordingChange, 
  onTranscription 
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // TODO: Integrate with speech-to-text API
        // For now, simulate transcription
        setTimeout(() => {
          onTranscription("This is simulated voice transcription. Real speech-to-text integration pending.");
        }, 1000);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingChange(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleRecording}
      className={`${
        isRecording 
          ? 'text-red-600 border-red-200 hover:bg-red-50 animate-pulse' 
          : 'text-purple-600 border-purple-200 hover:bg-purple-50'
      }`}
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Record Voice
        </>
      )}
    </Button>
  );
};

export default VoiceRecorder;
