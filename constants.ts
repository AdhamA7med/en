import { UserLevel } from './types';

export const LOCAL_STORAGE_KEY = 'lingoDailyAppData';

export const UserLevels: UserLevel[] = [
    UserLevel.Beginner,
    UserLevel.Intermediate,
    UserLevel.Advanced
];

export const BADGES = [
    { name: 'Word Novice', type: 'words', requirement: 10 },
    { name: 'Word Smith', type: 'words', requirement: 50 },
    { name: 'Lexicographer', type: 'words', requirement: 100 },
    { name: '3-Day Streak', type: 'streak', requirement: 3 },
    { name: '7-Day Streak', type: 'streak', requirement: 7 },
    { name: 'Perfect Week', type: 'streak', requirement: 7 },
    { name: 'Consistent Learner', type: 'streak', requirement: 14 },
];