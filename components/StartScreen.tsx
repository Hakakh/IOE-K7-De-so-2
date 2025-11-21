import React, { useState } from 'react';
import { Button } from './Button';

interface StartScreenProps {
  onStart: (name: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">IOE K9 Master</h1>
          <p className="text-slate-500">Practice makes perfect! Enter your name to begin the challenge.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Your Nickname</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EnglishWizard"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={!name.trim()}>
            Start Quiz
          </Button>
        </form>
      </div>
    </div>
  );
};