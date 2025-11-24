import React from 'react';

interface DilemmaControlsProps {
  onPluck: () => void;
  onLeave: () => void;
}

export const DilemmaControls: React.FC<DilemmaControlsProps> = ({ onPluck, onLeave }) => {
  return (
    <div className="mt-12 flex flex-col items-center gap-6 fade-in">
      <p className="text-lg font-serif text-gray-700">It is beautiful.</p>
      <div className="flex gap-8">
        <button 
          onClick={onPluck}
          className="px-8 py-3 bg-gray-900 text-white font-light tracking-widest rounded hover:bg-gray-700 hover:scale-105 transition-all shadow-xl"
        >
          PLUCK IT
        </button>
        <button 
          onClick={onLeave}
          className="px-8 py-3 border border-gray-400 text-gray-600 font-light tracking-widest rounded hover:border-gray-800 hover:text-gray-800 hover:scale-105 transition-all"
        >
          LEAVE IT BE
        </button>
      </div>
    </div>
  );
};