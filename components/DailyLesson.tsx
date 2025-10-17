import React from 'react';
import { DailyLessonData } from '../types';
import SentenceCard from './SentenceCard';

interface DailyLessonProps {
    lesson: DailyLessonData;
    onComplete: () => void;
}

const DailyLesson: React.FC<DailyLessonProps> = ({ lesson, onComplete }) => {
    
    const highlightWords = (sentence: string, words: string[]): React.ReactNode => {
        const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'gi');
        const parts = sentence.split(regex);
        return parts.map((part, index) => 
            words.some(word => new RegExp(`^${word}$`, 'i').test(part)) ? (
                <span key={index} className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };
    
    return (
        <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Today's Vocabulary</h2>
                <div className="flex flex-wrap gap-2">
                    {lesson.words.map((word, index) => (
                        <span key={index} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium">
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {lesson.sentences.map((sentence, index) => (
                   <SentenceCard 
                        key={index} 
                        sentence={{
                            english: highlightWords(sentence.english, lesson.words),
                            arabic: sentence.arabic
                        }}
                        originalEnglish={sentence.english}
                    />
                ))}
            </div>

            <div className="flex justify-center pt-4">
                 <button 
                    onClick={onComplete}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Mark Today's Lesson as Complete
                </button>
            </div>
        </div>
    );
};

export default DailyLesson;