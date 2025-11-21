import React from 'react';
import { Button } from './Button';
import { UserAnswer } from '../types';
import { QUIZ_DATA } from '../constants';

interface ResultScreenProps {
  userName: string;
  userAnswers: UserAnswer[];
  onRetryAll: () => void;
  onRetryWrong: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ userName, userAnswers, onRetryAll, onRetryWrong }) => {
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = userAnswers.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  const hasWrongAnswers = correctCount < totalQuestions;

  let message = "Keep practicing!";
  let color = "text-slate-600";
  if (percentage === 100) { message = "Perfect Score! You're a master!"; color = "text-yellow-500"; }
  else if (percentage >= 80) { message = "Great job! Almost perfect."; color = "text-green-500"; }
  else if (percentage >= 50) { message = "Good effort. Keep going!"; color = "text-blue-500"; }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full text-center">
        
        <div className="mb-8 relative inline-block">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle 
                    cx="60" cy="60" r="54" 
                    fill="none" 
                    stroke={percentage >= 80 ? '#10b981' : percentage >= 50 ? '#3b82f6' : '#ef4444'} 
                    strokeWidth="12"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 - (339.292 * percentage) / 100}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-800">{percentage}%</span>
            </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-lg text-slate-600 mb-4">Well done, <span className="font-bold text-blue-600">{userName}</span>!</p>
        <p className={`text-xl font-bold mb-8 ${color}`}>{message}</p>

        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="p-2">
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Correct</div>
            </div>
            <div className="p-2 border-l border-slate-200">
                <div className="text-3xl font-bold text-red-500">{totalQuestions - correctCount}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Wrong</div>
            </div>
        </div>

        {/* Detailed Review List */}
        {hasWrongAnswers && (
             <div className="text-left mb-8 max-h-60 overflow-y-auto custom-scrollbar border-t border-b border-slate-100 py-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Missed Questions</h3>
                <div className="space-y-3">
                    {userAnswers.filter(a => !a.isCorrect).map((ans, idx) => {
                        const q = QUIZ_DATA.find(q => q.id === ans.questionId);
                        if (!q) return null;
                        return (
                            <div key={idx} className="text-sm p-3 bg-red-50 rounded-lg">
                                <p className="font-medium text-slate-700 mb-1"><span className="text-red-500 font-bold mr-2">#{q.id}</span> {q.questionText}</p>
                                <p className="text-slate-500 text-xs">Correct: {q.correctAnswer}</p>
                            </div>
                        )
                    })}
                </div>
             </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onRetryAll} variant="primary" className="w-full sm:w-auto">
                Play Again (All)
            </Button>
            {hasWrongAnswers && (
                <Button onClick={onRetryWrong} variant="danger" className="w-full sm:w-auto">
                    Retry Wrong Answers
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};