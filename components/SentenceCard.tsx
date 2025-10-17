import React, { useState, useEffect, useRef } from 'react';
import { getPronunciationFeedback } from '../services/geminiService';

// Fix: Add TypeScript definitions for the Web Speech API
// These types are not included in the default TS DOM library.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

interface SentenceCardProps {
  sentence: {
      english: React.ReactNode;
      arabic: string;
  };
  originalEnglish: string;
}

type PracticeState = 'idle' | 'listening' | 'correct' | 'incorrect' | 'error';

const SentenceCard: React.FC<SentenceCardProps> = ({ sentence, originalEnglish }) => {
  const [practiceState, setPracticeState] = useState<PracticeState>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setPracticeState('listening');
      recognition.onend = () => {
          if (practiceState === 'listening') {
             setPracticeState('idle'); // Reset if stopped manually or timed out
          }
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setPracticeState('error');
        setFeedback('Sorry, there was an error with speech recognition.');
      };
      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const spokenText = event.results[0][0].transcript;
        const formattedSpoken = spokenText.trim().toLowerCase().replace(/[.,?!]/g, '');
        const formattedOriginal = originalEnglish.trim().toLowerCase().replace(/[.,?!]/g, '');

        if (formattedSpoken === formattedOriginal) {
          setPracticeState('correct');
          setFeedback('Perfect!');
        } else {
          setPracticeState('incorrect');
          const aiFeedback = await getPronunciationFeedback(originalEnglish, spokenText);
          setFeedback(aiFeedback);
        }
      };
      recognitionRef.current = recognition;
    }
  }, [originalEnglish, practiceState]);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(originalEnglish);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };
  
  const handlePractice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!recognitionRef.current) {
        alert("Sorry, your browser doesn't support speech recognition.");
        return;
    }
    if (practiceState === 'listening') {
        recognitionRef.current.stop();
        setPracticeState('idle');
    } else {
        setFeedback('');
        recognitionRef.current.start();
    }
  }
  
  const getBorderColor = () => {
      switch(practiceState) {
          case 'listening': return 'border-blue-500';
          case 'correct': return 'border-green-500';
          case 'incorrect': return 'border-red-500';
          case 'error': return 'border-yellow-500';
          default: return 'border-slate-100 dark:border-slate-700';
      }
  }

  return (
    <div className={`bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-2 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 ${getBorderColor()}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium ltr">
            {sentence.english}
          </p>
          <p className="text-md text-slate-500 dark:text-slate-400 mt-2 font-arabic rtl text-right" dir="rtl">
            {sentence.arabic}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handlePractice}
              className={`p-2 rounded-full transition-colors duration-200 ${practiceState === 'listening' ? 'bg-blue-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700'}`}
              aria-label="Practice pronunciation"
            >
              <MicIcon />
            </button>
            <button
              onClick={handlePlayAudio}
              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
              aria-label="Play audio"
            >
              <SpeakerIcon />
            </button>
        </div>
      </div>
       {(practiceState === 'correct' || practiceState === 'incorrect' || practiceState === 'error') && feedback && (
        <div className={`mt-3 p-3 rounded-lg text-sm text-right font-arabic ${practiceState === 'correct' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`} dir="rtl">
          {feedback}
        </div>
      )}
    </div>
  );
};

const SpeakerIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>);
const MicIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>);


export default SentenceCard;
