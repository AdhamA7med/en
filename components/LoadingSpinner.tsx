import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-700 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Generating your personalized lesson...</p>
    </div>
  );
};

export default LoadingSpinner;