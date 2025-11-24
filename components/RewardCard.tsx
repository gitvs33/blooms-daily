import React, { useEffect, useRef, useState } from 'react';
import { FlowerData } from '../types';
import { generateLifeQuote } from '../services/geminiService';

interface RewardCardProps {
  flower: FlowerData;
  imageSrc: string;
  onRestart: () => void;
  isWithered: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ flower, imageSrc, onRestart, isWithered }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [quote, setQuote] = useState<string>("Generating reflection...");
  const [isQuoteReady, setIsQuoteReady] = useState(false);

  // Fetch quote on mount
  useEffect(() => {
    const fetchQuote = async () => {
      const q = await generateLifeQuote(flower.name, isWithered);
      setQuote(q);
      setIsQuoteReady(true);
    };
    fetchQuote();
  }, [flower.name, isWithered]);

  // Draw canvas when image and quote are ready
  useEffect(() => {
    if (isQuoteReady && canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => {
        // 1. Setup Canvas Layout (Card Style)
        // Increased height to ensure text fits
        canvas.width = 600;
        canvas.height = 900;
        
        // Background - Cream/White
        ctx.fillStyle = "#fdfbf7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Image Box (Square at top)
        const margin = 50;
        const imgSize = 500; // Square box
        const imgY = 60;
        
        // Draw placeholder/bg for image area
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(margin, imgY, imgSize, imgSize);

        // Aspect Fill (Cover) Logic
        const scale = Math.max(imgSize / img.width, imgSize / img.height);
        const xOffset = (imgSize / 2) - (img.width / 2) * scale;
        const yOffset = (imgSize / 2) - (img.height / 2) * scale;

        ctx.save();
        ctx.beginPath();
        ctx.rect(margin, imgY, imgSize, imgSize);
        ctx.clip();
        ctx.drawImage(img, margin + xOffset, imgY + yOffset, img.width * scale, img.height * scale);
        ctx.restore();

        // Optional Border for Image
        ctx.strokeStyle = "#cbd5e0";
        ctx.lineWidth = 1;
        ctx.strokeRect(margin, imgY, imgSize, imgSize);

        // 3. Draw Text Section (Bottom)
        const textStartY = imgY + imgSize + 60; // Start text below image
        
        ctx.textAlign = "center";
        
        // Month/Flower Title
        ctx.fillStyle = "#4a5568"; // Cool gray
        ctx.font = "bold 18px 'Lato'";
        ctx.fillText(`${flower.month.toUpperCase()} • ${flower.name.toUpperCase()}`, canvas.width / 2, textStartY);
        
        // The Quote
        ctx.fillStyle = "#1a202c"; // Darker gray/black for main text
        ctx.font = "italic 32px 'Playfair Display'";
        
        // Ensure quote has quotes
        const cleanQuote = quote.replace(/^["']|["']$/g, '');
        const displayQuote = `"${cleanQuote}"`;

        wrapText(ctx, displayQuote, canvas.width / 2, textStartY + 50, 500, 42);
        
        // Footer
        ctx.fillStyle = "#a0aec0";
        ctx.font = "14px 'Lato'";
        ctx.fillText("The Garden of Dilemma", canvas.width / 2, canvas.height - 30);
      };
    }
  }, [isQuoteReady, quote, imageSrc, flower]);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const downloadCard = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `memorial-${flower.name.toLowerCase()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const title = isWithered ? "Your Memorial" : "Your Celebration";

  return (
    <div className="flex flex-col items-center gap-6 fade-in w-full max-w-lg mb-12">
       <h2 className="text-2xl font-serif font-bold mb-2">{title}</h2>
       <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white">
          <canvas ref={canvasRef} className="w-full h-auto block max-h-[75vh]" />
       </div>
       <div className="flex gap-4">
         <button 
           onClick={downloadCard} 
           className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg"
         >
           Download Card
         </button>
         <button 
           onClick={onRestart} 
           className="px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
         >
           Start Over
         </button>
       </div>
    </div>
  );
};