export enum UserLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}

export interface Sentence {
    english: string;
    arabic: string;
}

export interface DailyLessonData {
    date: string;
    words: string[];
    sentences: Sentence[];
}

export interface ProgressData {
    streak: number;
    points: number;
    wordsMastered: number;
    badges: string[];
}

export interface QuizQuestion {
    id: number;
    word: string;
    options: string[];
    correctAnswer: string;
    arabicTranslation: string;
}