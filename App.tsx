import React, { useState, useEffect, useCallback } from 'react';
import { MonthGrid } from './components/MonthGrid';
import { FlowerDisplay } from './components/FlowerDisplay';
import { DilemmaControls } from './components/DilemmaControls';
import { PenaltyView } from './components/PenaltyView';
import { RewardCard } from './components/RewardCard';
import { FlowerData, AppPhase } from './types';
import { FLOWER_DATA } from './constants';
import { generateNanoBananaPrompt } from './services/geminiService';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.SELECTION);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<FlowerData | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isWithered, setIsWithered] = useState(true);

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setSelectedFlower(FLOWER_DATA[monthIndex]);
    setPhase(AppPhase.GROWING);
  };

  // Simulate growing animation time
  useEffect(() => {
    if (phase === AppPhase.GROWING) {
      const timer = setTimeout(() => {
        setPhase(AppPhase.DILEMMA);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handlePluck = () => {
    setPhase(AppPhase.QUESTION_LIKE_LOVE);
  };

  const handleLeave = () => {
    setIsWithered(false);
    setPhase(AppPhase.LOVE_LESSON);
  };

  const handleAnswerLove = () => {
    setIsWithered(false);
    setPhase(AppPhase.LOVE_LESSON);
  };

  const handleAnswerLike = () => {
    setIsWithered(true);
    setPhase(AppPhase.BROKEN);
    // After a brief moment of "breaking", move to generation task
    setTimeout(() => {
      prepareGeneration(true);
    }, 2000);
  };

  const prepareGeneration = async (withered: boolean) => {
    setPhase(AppPhase.GENERATION);
    if (selectedFlower) {
      setIsGeneratingPrompt(true);
      try {
        const prompt = await generateNanoBananaPrompt(selectedFlower.name, withered);
        setGeneratedPrompt(prompt);
      } catch (error) {
        console.error("Failed to generate prompt", error);
        setGeneratedPrompt(
          withered 
            ? `A withered ${selectedFlower.name} on a cold concrete floor, dramatic lighting, melancholic style.`
            : `A beautiful blooming ${selectedFlower.name}, radiant light, ethereal style.`
        );
      } finally {
        setIsGeneratingPrompt(false);
      }
    }
  };

  const handleContinueToGeneration = () => {
    prepareGeneration(false);
  };

  const handleImageReady = (imageData: string) => {
    setFinalImage(imageData);
    setPhase(AppPhase.REWARD);
  };

  const handleRestart = () => {
    setPhase(AppPhase.SELECTION);
    setSelectedMonth(null);
    setSelectedFlower(null);
    setGeneratedPrompt("");
    setFinalImage(null);
    setIsWithered(true);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-8 relative">
      {/* Header */}
      <header className="text-center mb-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wider">
          {phase === AppPhase.SELECTION ? "THE GARDEN" : selectedFlower?.name.toUpperCase()}
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">
          {phase === AppPhase.SELECTION ? "Select your birth month" : "Phase: " + phase}
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        
        {phase === AppPhase.SELECTION && (
          <MonthGrid onSelect={handleMonthSelect} />
        )}

        {(phase === AppPhase.GROWING || 
          phase === AppPhase.DILEMMA || 
          phase === AppPhase.QUESTION_LIKE_LOVE ||
          phase === AppPhase.BROKEN ||
          phase === AppPhase.LOVE_LESSON) && selectedFlower && (
          <div className="w-full flex flex-col items-center">
            <FlowerDisplay 
              flower={selectedFlower} 
              phase={phase} 
              isWithered={isWithered}
            />
            
            {phase === AppPhase.DILEMMA && (
              <DilemmaControls 
                onPluck={handlePluck} 
                onLeave={handleLeave} 
              />
            )}

            {phase === AppPhase.QUESTION_LIKE_LOVE && (
              <div className="mt-8 text-center fade-in">
                 <div className="text-6xl mb-4">😢</div>
                 <h3 className="text-2xl font-serif mb-6">Do you <span className="font-bold text-pink-600">Like</span> this flower, or do you <span className="font-bold text-red-700">Love</span> it?</h3>
                 <div className="flex gap-4 justify-center">
                   <button onClick={handleAnswerLike} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-all">
                     I Like it
                   </button>
                   <button onClick={handleAnswerLove} className="px-8 py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-full transition-all">
                     I Love it
                   </button>
                 </div>
              </div>
            )}

            {phase === AppPhase.LOVE_LESSON && (
               <div className="mt-8 text-center max-w-md fade-in bg-white p-8 rounded-lg shadow-xl border border-green-100">
                  <p className="text-xl font-serif text-green-800 leading-relaxed mb-6">
                    "If you love a flower, you don't pluck it. You water it. <br/>
                    Beauty is meant to be nurtured, not possessed."
                  </p>
                  <button onClick={handleContinueToGeneration} className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg font-light tracking-wide">
                    Capture this Moment
                  </button>
               </div>
            )}
          </div>
        )}

        {phase === AppPhase.GENERATION && selectedFlower && (
          <PenaltyView 
            flower={selectedFlower}
            prompt={generatedPrompt}
            isGeneratingPrompt={isGeneratingPrompt}
            onImageReady={handleImageReady}
            isWithered={isWithered}
          />
        )}

        {phase === AppPhase.REWARD && selectedFlower && finalImage && (
          <RewardCard 
            flower={selectedFlower}
            imageSrc={finalImage}
            onRestart={handleRestart}
            isWithered={isWithered}
          />
        )}
      </main>
      
      {/* Footer / Credits */}
      <footer className="mt-12 text-center text-gray-400 text-xs">
        <p>&copy; {new Date().getFullYear()} The Garden of Dilemma</p>
      </footer>
    </div>
  );
}