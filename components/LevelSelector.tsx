import React from 'react';
import { UserLevel } from '../types';
import { UserLevels } from '../constants';

interface LevelSelectorProps {
  onSelectLevel: (level: UserLevel) => void;
}

const levelDescriptions: Record<UserLevel, string> = {
  [UserLevel.Beginner]: 'Start with basic words and simple sentence structures.',
  [UserLevel.Intermediate]: 'Expand your vocabulary and tackle more complex sentences.',
  [UserLevel.Advanced]: 'Challenge yourself with sophisticated words and nuanced phrases.',
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome to Lingo Daily!</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">Choose your level to start your daily English learning journey.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {UserLevels.map((level) => (
          <button
            key={level}
            onClick={() => onSelectLevel(level)}
            className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{level}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{levelDescriptions[level]}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;