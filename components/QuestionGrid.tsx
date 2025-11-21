import React from 'react';
import { Question, UserAnswer } from '../types';
import { Button } from './Button';

interface QuestionGridProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  onJump: (index: number) => void;
  onClose: () => void;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({ questions, userAnswers, currentIndex, onJump, onClose }) => {
  
  const getStatusColor = (q: Question, index: number) => {
    const answer = userAnswers.find(a => a.questionId === q.id);
    if (index === currentIndex) return "ring-2 ring-blue-500 ring-offset-2 border-blue-500 bg-white text-blue-600";
    if (!answer) return "bg-slate-100 text-slate-400 border-transparent"; // Unanswered
    if (answer.skipped) return "bg-yellow-100 text-yellow-600 border-yellow-300"; // Skipped explicitly (if we add that state) - currently just unanswered logic handles it, but if we want answered state:
    if (answer.isCorrect) return "bg-green-500 text-white border-green-600";
    return "bg-red-500 text-white border-red-600";
  };

  const answeredCount = userAnswers.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Question Navigator</h2>
                <p className="text-sm text-slate-500">Completed: {answeredCount} / {questions.length}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {questions.map((q, idx) => (
                    <button
                        key={q.id}
                        onClick={() => { onJump(idx); onClose(); }}
                        className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all hover:scale-105 ${getStatusColor(q, idx)}`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex gap-4 justify-center flex-wrap">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Correct</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Incorrect</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 ring-2 ring-blue-500 ring-offset-1 rounded-full"></span> Current</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-full"></span> Unanswered</div>
        </div>
      </div>
    </div>
  );
};
