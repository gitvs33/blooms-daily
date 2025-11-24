import React, { useState, useRef } from 'react';
import { FlowerData } from '../types';
import { generateFlowerImage } from '../services/geminiService';

interface PenaltyViewProps {
  flower: FlowerData;
  prompt: string;
  isGeneratingPrompt: boolean;
  onImageReady: (imageData: string) => void;
  isWithered: boolean;
}

export const PenaltyView: React.FC<PenaltyViewProps> = ({ flower, prompt, isGeneratingPrompt, onImageReady, isWithered }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageReady(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNanoBananaGenerate = async () => {
    setIsGeneratingImage(true);
    setError(null);
    try {
      const imageData = await generateFlowerImage(prompt);
      if (imageData) {
        onImageReady(imageData);
      } else {
        setError("The model could not generate an image. Please try uploading one instead.");
      }
    } catch (e) {
      setError("Generation failed. Please check API Key or try uploading.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const title = isWithered ? "The Flower is Gone" : "The Flower Thrives";
  const subtitle = isWithered 
    ? "You have taken the flower. To understand its value, you must create a memorial."
    : "You have chosen to nurture life. Capture this beautiful moment to cherish it.";
  const emoji = isWithered ? "🥀" : "🌸";
  const containerStyle = isWithered ? "border-gray-800" : "border-pink-400 bg-pink-50";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-100 fade-in mt-4">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-serif font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">
          {subtitle}
        </p>
      </div>

      <div className={`p-6 rounded-md border-l-4 mb-8 relative ${containerStyle} bg-opacity-20`}>
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">
          {isWithered ? "Your Nano Banana Task Prompt" : "Your Creation Prompt"}
        </h3>
        {isGeneratingPrompt ? (
          <div className="flex items-center gap-2 text-gray-500 italic">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            Consulting the muse...
          </div>
        ) : (
          <p className="font-serif text-lg text-gray-800 italic">
            "{prompt}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Upload */}
        <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
          <h4 className="font-bold text-gray-700 mb-2">Upload Art</h4>
          <p className="text-xs text-center text-gray-500 mb-4">Use Midjourney/DALL-E with the prompt above</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
          >
            Select File
          </button>
        </div>

        {/* Option 2: Nano Banana Gen */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2">Generate Here</h4>
          <p className="text-xs text-center text-indigo-600 mb-4">Use Gemini "Nano Banana" Model</p>
          <button 
            onClick={handleNanoBananaGenerate}
            disabled={isGeneratingImage || isGeneratingPrompt}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isGeneratingImage ? 'Dreaming...' : 'Generate AI Art'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs text-center mt-4">{error}</p>}
    </div>
  );
};