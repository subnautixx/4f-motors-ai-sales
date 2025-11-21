import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div 
      className="w-full border-2 border-dashed border-brand-gray hover:border-brand-gold/50 transition-colors rounded-2xl bg-brand-gray/20 h-64 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      
      <div className="p-4 rounded-full bg-brand-gray/50 group-hover:bg-brand-gold/20 transition-all mb-4">
        <Upload className="w-8 h-8 text-brand-gold" />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1">Upload Vehicle Photo</h3>
      <p className="text-zinc-400 text-sm">Drag & drop or click to select</p>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
        <ImageIcon className="w-4 h-4" />
        <span>Supports JPG, PNG (Max 10MB)</span>
      </div>
    </div>
  );
};