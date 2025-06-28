
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  uploadedImage: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileSelect}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Image
      </Button>

      {uploadedImage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearImage}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
