import React, { useState } from 'react';
import { QUIZ_DATA } from './constants';
import { Question, UserAnswer, GameState, QuestionType } from './types';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { ResultScreen } from './components/ResultScreen';
import { Button } from './components/Button';
import { QuestionGrid } from './components/QuestionGrid';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userName, setUserName] = useState('');
  
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const handleStart = (name: string) => {
    setUserName(name);
    startSession(QUIZ_DATA);
  };

  const startSession = (questions: Question[]) => {
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]); 
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (response: string) => {
    const currentQ = activeQuestions[currentQuestionIndex];
    
    let isCorrect = false;
    if (currentQ.type === QuestionType.REARRANGE) {
        isCorrect = response.replace(/\s+/g, ' ').trim() === currentQ.correctAnswer.replace(/\s+/g, ' ').trim();
    } else {
        isCorrect = response.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    }

    const newAnswer: UserAnswer = {
      questionId: currentQ.id,
      userResponse: response,
      isCorrect
    };

    // Update or Add answer
    setUserAnswers(prev => {
        const existing = prev.filter(a => a.questionId !== currentQ.id);
        return [...existing, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Just move next without recording an answer
    handleNext();
  };

  const handleFinish = () => {
    setGameState(GameState.FINISHED);
  };

  const handleRetryAll = () => {
    startSession(QUIZ_DATA);
  };

  const handleRetryWrong = () => {
    const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
    // Also include unanswered questions in "retry wrong" logic or just pure wrong? 
    // Requirement says "retry wrong". Let's strict to wrong answers.
    // But user might want to finish incomplete ones. Let's stick to strictly WRONG ones for this button.
    const wrongQuestions = QUIZ_DATA.filter(q => wrongIds.includes(q.id));
    startSession(wrongQuestions);
  };

  // Render Logic
  if (gameState === GameState.START) {
    return <StartScreen onStart={handleStart} />;
  }

  if (gameState === GameState.FINISHED) {
    return (
      <ResultScreen 
        userName={userName} 
        userAnswers={userAnswers}
        onRetryAll={handleRetryAll}
        onRetryWrong={handleRetryWrong}
      />
    );
  }

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswerObj = userAnswers.find(a => a.questionId === currentQuestion.id);
  const isAnswered = !!currentAnswerObj;
  const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;
  const allAnswered = userAnswers.length === activeQuestions.length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 pb-32 relative">
      
      {/* Top Bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
         <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase">Player</span>
            <span className="font-bold text-slate-700">{userName}</span>
         </div>
         
         <button 
            onClick={() => setShowGrid(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition-colors"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Map
         </button>

         <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase">Progress</span>
            <span className="font-bold text-blue-600 text-xl">
                {currentQuestionIndex + 1} <span className="text-slate-400 text-sm">/ {activeQuestions.length}</span>
            </span>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
        <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out" 
            style={{ width: `${(userAnswers.length / activeQuestions.length) * 100}%` }}
        ></div>
      </div>

      <QuestionCard 
        question={currentQuestion} 
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
        userAnswer={currentAnswerObj?.userResponse || null}
      />

      {/* Sticky Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
          <div className="w-full max-w-3xl mx-auto flex justify-between items-center gap-4">
             
             <Button 
                onClick={handlePrev} 
                variant="outline" 
                disabled={currentQuestionIndex === 0}
                className="w-24"
             >
                ← Prev
             </Button>

             <div className="flex-1 flex justify-center gap-3">
                 {isAnswered ? (
                    <>
                        {!isLastQuestion && (
                            <Button onClick={handleNext} size="md" className="shadow-xl shadow-blue-500/20 animate-bounce-short">
                                Next Question →
                            </Button>
                        )}
                        <Button 
                            onClick={handleFinish} 
                            variant={allAnswered ? "secondary" : "danger"}
                            className={allAnswered ? "animate-pulse" : ""}
                        >
                            Finish Quiz
                        </Button>
                    </>
                 ) : (
                    <Button onClick={handleSkip} variant="outline" className="text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600">
                        Skip for now
                    </Button>
                 )}
             </div>

             <Button 
                onClick={handleNext} 
                variant="outline"
                disabled={isLastQuestion} 
                className={`w-24 ${isAnswered ? 'opacity-0 pointer-events-none hidden sm:flex' : ''}`} // Hide next if answered because central button takes over
             >
                Next →
             </Button>
          </div>
      </div>

      {showGrid && (
        <QuestionGrid 
            questions={activeQuestions}
            userAnswers={userAnswers}
            currentIndex={currentQuestionIndex}
            onJump={setCurrentQuestionIndex}
            onClose={() => setShowGrid(false)}
        />
      )}

    </div>
  );
};

export default App;
