import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onFinish: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(i => i + 1);
  };
  
  if (questions.length === 0) {
      return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Not Enough History for a Quiz</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Complete a few more lessons to unlock the Smart Review Quiz!</p>
            <button onClick={onFinish} className="mt-4 bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                Back to Review
            </button>
        </div>
      )
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quiz Complete!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 my-4">
          You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of <span className="font-bold">{questions.length}</span>.
        </p>
        <button onClick={onFinish} className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          Finish Review
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg space-y-6">
      <div>
        <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Smart Review Quiz</h2>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
            </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">Which sentence correctly uses the word:</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center py-2">"{currentQuestion.word}"?</p>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map(option => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            
            let buttonClass = 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700';
            if(isAnswered) {
                if(isCorrect) buttonClass = 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200';
                else if (isSelected) buttonClass = 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200';
            }

          return (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${buttonClass} ${!isAnswered && 'cursor-pointer'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      
       {isAnswered && (
          <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-center space-y-4">
             <p className="font-arabic rtl text-right text-slate-600 dark:text-slate-300" dir="rtl">
                <span className="font-bold">الترجمة:</span> {currentQuestion.arabicTranslation}
            </p>
            <button onClick={handleNextQuestion} className="w-full sm:w-auto bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600">
                Next Question
            </button>
          </div>
        )}
    </div>
  );
};

export default Quiz;