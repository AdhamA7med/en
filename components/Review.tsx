import React, { useState } from 'react';
import { DailyLessonData } from '../types';
import SentenceCard from './SentenceCard';

interface ReviewProps {
    history: DailyLessonData[];
    onStartQuiz: () => void;
}

const Review: React.FC<ReviewProps> = ({ history, onStartQuiz }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    
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

    if (history.length === 0) {
        return (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No History Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Complete your first lesson to start building your review history!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Learning History</h2>
             
             {history.length >= 1 && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Ready to test your knowledge?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Take a quick quiz based on your past lessons.</p>
                    <button 
                        onClick={onStartQuiz}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Start Smart Review Quiz
                    </button>
                </div>
            )}

            {history.map((lesson, index) => (
                <div key={lesson.date} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full p-5 flex justify-between items-center text-left"
                    >
                        <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">
                            Lesson from {new Date(lesson.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <ChevronDownIcon isOpen={openIndex === index} />
                    </button>
                    {openIndex === index && (
                        <div className="p-5 border-t border-slate-200 dark:border-slate-700 space-y-3">
                            <h4 className="font-bold text-slate-600 dark:text-slate-300">Vocabulary:</h4>
                             <div className="flex flex-wrap gap-2 mb-4">
                                {lesson.words.map((word, i) => (
                                    <span key={i} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium">
                                        {word}
                                    </span>
                                ))}
                            </div>
                            {lesson.sentences.map((s, i) => (
                                <SentenceCard 
                                    key={i} 
                                    sentence={{ 
                                        english: highlightWords(s.english, lesson.words),
                                        arabic: s.arabic 
                                    }}
                                    originalEnglish={s.english}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const ChevronDownIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 text-slate-500 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


export default Review;