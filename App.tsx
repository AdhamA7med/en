import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserLevel, DailyLessonData, ProgressData, QuizQuestion } from './types';
import { generateDailyLesson } from './services/geminiService';
import { LOCAL_STORAGE_KEY, UserLevels, BADGES } from './constants';
import LevelSelector from './components/LevelSelector';
import DailyLesson from './components/DailyLesson';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import Review from './components/Review';
import ErrorDisplay from './components/ErrorDisplay';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [dailyData, setDailyData] = useState<DailyLessonData | null>(null);
  const [progress, setProgress] = useState<ProgressData>({ streak: 0, points: 0, wordsMastered: 0, badges: [] });
  const [history, setHistory] = useState<DailyLessonData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'lesson' | 'review' | 'quiz'>('lesson');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const saveDataToLocalStorage = useCallback(() => {
    try {
      const appData = { userLevel, dailyData, progress, history, theme };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error("Failed to save data to local storage", e);
    }
  }, [userLevel, dailyData, progress, history, theme]);

  const loadDataFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.userLevel) setUserLevel(parsedData.userLevel);
        if (parsedData.progress) setProgress(parsedData.progress);
        if (parsedData.history) setHistory(parsedData.history);
        if (parsedData.theme) setTheme(parsedData.theme);

        const today = new Date().toISOString().split('T')[0];
        if (parsedData.dailyData && parsedData.dailyData.date === today) {
          setDailyData(parsedData.dailyData);
        }
        return parsedData.userLevel;
      }
    } catch (e) {
      console.error("Failed to load data from local storage", e);
    }
    return null;
  }, []);

  const fetchNewLesson = useCallback(async (level: UserLevel) => {
    setIsLoading(true);
    setError(null);
    try {
      const lesson = await generateDailyLesson(level);
      const today = new Date().toISOString().split('T')[0];
      const newDailyData: DailyLessonData = { ...lesson, date: today };
      setDailyData(newDailyData);
      setView('lesson');
    } catch (err) {
      console.error(err);
      setError("Failed to generate a new lesson. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const loadedLevel = loadDataFromLocalStorage();
    const today = new Date().toISOString().split('T')[0];
    if (loadedLevel && (!dailyData || dailyData.date !== today)) {
      fetchNewLesson(loadedLevel);
    } else {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userLevel) { // Only save if a user profile exists
      saveDataToLocalStorage();
    }
  }, [userLevel, dailyData, progress, history, theme, saveDataToLocalStorage]);

  const handleLevelSelect = (level: UserLevel) => {
    setUserLevel(level);
    fetchNewLesson(level);
  };

  const handleLessonComplete = () => {
    setProgress(prev => {
        const newPoints = prev.points + 10;
        const newWordsMastered = prev.wordsMastered + (dailyData?.words.length || 0);
        const newStreak = prev.streak + 1;

        const newBadges = [...prev.badges];
        BADGES.forEach(badge => {
            if (!newBadges.includes(badge.name)) {
                if (badge.type === 'streak' && newStreak >= badge.requirement) {
                    newBadges.push(badge.name);
                }
                if (badge.type === 'words' && newWordsMastered >= badge.requirement) {
                    newBadges.push(badge.name);
                }
            }
        });
        
        return { points: newPoints, wordsMastered: newWordsMastered, streak: newStreak, badges: newBadges };
    });

    if (dailyData) {
        setHistory(prev => [dailyData, ...prev.filter(h => h.date !== dailyData.date)]);
    }
    alert("Great job! You've completed today's lesson. Your progress has been saved.");
  };
  
  const quizQuestions = useMemo((): QuizQuestion[] => {
    if (history.length === 0) return [];
    
    const allSentences = history.flatMap(h => h.sentences.map(s => ({...s, words: h.words})));
    if(allSentences.length < 4) return [];

    const shuffled = allSentences.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map((correctSentence, index) => {
        const correctWord = correctSentence.words.find(w => new RegExp(`\\b${w}\\b`, 'i').test(correctSentence.english));
        const otherOptions = allSentences
            .filter(s => s.english !== correctSentence.english)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(s => s.english);

        const options = [correctSentence.english, ...otherOptions].sort(() => 0.5 - Math.random());
        
        return {
            id: index,
            word: correctWord || correctSentence.words[0],
            options: options,
            correctAnswer: correctSentence.english,
            arabicTranslation: correctSentence.arabic
        };
    });
}, [history]);


  const handleRetry = () => {
    if (userLevel) {
      fetchNewLesson(userLevel);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!userLevel) return <LevelSelector onSelectLevel={handleLevelSelect} />;
    if (error) return <ErrorDisplay message={error} onRetry={handleRetry} />;
    
    switch(view) {
        case 'review':
            return <Review history={history} onStartQuiz={() => setView('quiz')} />;
        case 'quiz':
            return <Quiz questions={quizQuestions} onFinish={() => setView('review')} />;
        case 'lesson':
        default:
             if (dailyData) {
                return <DailyLesson lesson={dailyData} onComplete={handleLessonComplete} />;
             }
             return <ErrorDisplay message="No lesson available for today. Try refreshing." onRetry={handleRetry} />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        progress={progress} 
        setView={setView} 
        currentView={view} 
        showNav={!!userLevel}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="container mx-auto p-4 sm:p-6 max-w-4xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;