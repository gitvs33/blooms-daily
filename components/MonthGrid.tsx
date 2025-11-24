import React from 'react';
import { MONTHS } from '../constants';

interface MonthGridProps {
  onSelect: (index: number) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-3xl fade-in">
      {MONTHS.map((month) => (
        <button
          key={month.id}
          onClick={() => onSelect(month.id)}
          className="aspect-square border-2 border-gray-200 hover:border-gray-400 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center rounded-lg group"
        >
          <span className="text-2xl font-serif font-bold text-gray-300 group-hover:text-gray-800 transition-colors">
            {month.name}
          </span>
        </button>
      ))}
    </div>
  );
};