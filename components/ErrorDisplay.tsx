import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg text-center shadow-md">
      <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Oops, something went wrong.</h3>
      <p className="text-red-600 dark:text-red-400 my-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;