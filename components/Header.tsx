import React from 'react';
import { ProgressData } from '../types';

interface HeaderProps {
    progress: ProgressData;
    setView: (view: 'lesson' | 'review' | 'quiz') => void;
    currentView: 'lesson' | 'review' | 'quiz';
    showNav: boolean;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const StatCard: React.FC<{ label: string; value: number | string, icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="text-blue-500 dark:text-blue-400">{icon}</div>
        <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);

const Header: React.FC<HeaderProps> = ({ progress, setView, currentView, showNav, theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-md sticky top-0 z-10">
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">Lingo Daily</h1>
                    <div className="flex items-center space-x-2">
                        {showNav && (
                           <div className="hidden sm:flex items-center space-x-2">
                               <StatCard label="Badges" value={progress.badges.length} icon={<BadgeIcon />} />
                               <StatCard label="Streak" value={`${progress.streak} days`} icon={<FireIcon />} />
                               <StatCard label="Points" value={progress.points} icon={<StarIcon />} />
                               <StatCard label="Words" value={progress.wordsMastered} icon={<BookIcon />} />
                           </div>
                        )}
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </div>
                 {showNav && (
                    <div className="grid grid-cols-2 sm:hidden gap-2 mb-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                         <StatCard label="Streak" value={`${progress.streak} d`} icon={<FireIcon />} />
                         <StatCard label="Points" value={progress.points} icon={<StarIcon />} />
                         <StatCard label="Words" value={progress.wordsMastered} icon={<BookIcon />} />
                         <StatCard label="Badges" value={progress.badges.length} icon={<BadgeIcon />} />
                    </div>
                )}
                {showNav && (
                    <nav className="flex border-b border-slate-200 dark:border-slate-700">
                        {['lesson', 'review', 'quiz'].map((viewName) => (
                             <button
                                key={viewName}
                                onClick={() => setView(viewName as 'lesson' | 'review' | 'quiz')}
                                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors duration-200 ${
                                    currentView === viewName
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
                                }`}
                            >
                                {viewName === 'lesson' ? "Today's Lesson" : viewName}
                            </button>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
};

// Icons
const FireIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A5 5 0 0012.014 13m2.828-2.828A5 5 0 0013 12M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>);
const BookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const BadgeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>);
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);

export default Header;