/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Award, RotateCcw, ChevronRight, CheckCircle2, Calendar, FileText, Sparkles } from 'lucide-react';
import { Quiz, Language, TRANSLATIONS, VideoTutorial } from '../types';

interface QuizSectionProps {
  quiz: Quiz | undefined;
  tutorial: VideoTutorial;
  currentLanguage: Language;
  userName?: string;
  onPassQuiz: (score: number) => void;
  onClose: () => void;
  onQuizProgressUpdate?: (tutorialId: string, currentQuestionIdx: number, totalQuestions: number, isFinished: boolean) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quiz,
  tutorial,
  currentLanguage,
  userName = "Trainee",
  onPassQuiz,
  onClose,
  onQuizProgressUpdate,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersLog, setAnswersLog] = useState<{ questionIdx: number; selectedIdx: number; correct: boolean }[]>([]);

  // AI Hint States
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);

  useEffect(() => {
    if (quiz && quiz.questions && quiz.questions.length > 0 && onQuizProgressUpdate) {
      onQuizProgressUpdate(tutorial.id, currentQuestionIdx, quiz.questions.length, quizFinished);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIdx, quizFinished, tutorial.id, quiz?.questions?.length, onQuizProgressUpdate]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        No quiz available for this module.
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }

    setAnswersLog((prev) => [
      ...prev,
      { questionIdx: currentQuestionIdx, selectedIdx: selectedOption, correct: isCorrect }
    ]);

    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setAiHint(null);
    setHintError(null);
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finished
      setQuizFinished(true);
      const finalScore = Math.round((correctAnswersCount / quiz.questions.length) * 100);
      onPassQuiz(finalScore);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
    setAnswersLog([]);
    setAiHint(null);
    setHintError(null);
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    setHintError(null);
    setAiHint(null);
    try {
      const response = await fetch('/api/ai/quiz-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          options: currentQuestion.options,
          currentLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hint from AI Trainer.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiHint(data.text);
    } catch (err: any) {
      console.error('Quiz hint error:', err);
      setHintError(err.message || 'Hint helper is not available.');
    } finally {
      setIsHintLoading(false);
    }
  };

  const finalScorePercent = Math.round((correctAnswersCount / quiz.questions.length) * 100);
  const passed = finalScorePercent >= 70;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
      
      {/* Absolute background accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <h3 className="font-extrabold text-slate-100 tracking-tight">
            {t.quizResults}: {tutorial.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
        >
          Exit Quiz
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Question Counter & Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>QUESTION {currentQuestionIdx + 1} OF {quiz.questions.length}</span>
                <span className="text-cyan-400">{Math.round(((currentQuestionIdx) / quiz.questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIdx) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {currentQuestion.question}
            </h4>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;
                
                let optionStyle = 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200';
                
                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                  } else if (isSelected) {
                    optionStyle = 'bg-red-500/15 border-red-500/50 text-red-300';
                  } else {
                    optionStyle = 'bg-slate-850 border-slate-800 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-950/25';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`text-left text-sm p-4 rounded-lg border font-medium flex items-center justify-between transition-all ${optionStyle} ${
                      !isSubmitted ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
                    }`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrectOption && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <X className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Clue/Hint Section */}
            {(isHintLoading || aiHint || hintError) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed space-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-full" />
                
                <div className="flex items-center gap-1.5 font-extrabold text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>Wee Hur AI Trainer - Hint Clue</span>
                </div>
                {isHintLoading && (
                  <p className="text-slate-400 animate-pulse font-medium">Formulating safe-site safety logic clue...</p>
                )}
                {hintError && (
                  <p className="text-red-400 font-medium">⚠️ {hintError}</p>
                )}
                {aiHint && (
                  <p className="text-slate-300 font-sans">{aiHint}</p>
                )}
              </motion.div>
            )}

            {/* Explanation & Feedback */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/20 text-red-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {selectedOption === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t.correct}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-400" />
                      <span>{t.incorrect}</span>
                    </>
                  )}
                </div>
                <p className="opacity-90">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {!isSubmitted && (
                  <button
                    onClick={handleGetHint}
                    disabled={isHintLoading}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2.5 rounded-lg border border-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>{isHintLoading ? 'AI Thinking...' : 'Get AI Trainer Hint'}</span>
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <span>{currentQuestionIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Finished Quiz View (Certificate & Performance) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center py-4"
          >
            {/* Score circle badge */}
            <div className="inline-block relative">
              <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-lg ${
                passed 
                  ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' 
                  : 'border-amber-500 bg-amber-500/5 text-amber-400'
              }`}>
                <span className="text-3xl font-extrabold">{finalScorePercent}%</span>
                <span className="text-[10px] font-bold tracking-widest uppercase">SCORE</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 shadow-md border border-slate-800">
                {passed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                ) : (
                  <X className="w-6 h-6 text-amber-500 fill-amber-950" />
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-100">
                {passed ? t.congrats : 'Quiz Unsuccessful'}
              </h4>
              <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                {passed
                  ? t.passXp.replace('{xp}', String(tutorial.xpValue))
                  : t.failedQuiz}
              </p>
            </div>

            {/* Certificate of training completion */}
            {passed && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-xl mx-auto bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-2xl border-4 border-cyan-500 relative text-left keep-default-colors"
              >
                {/* Certificate Background Pattern */}
                <div className="absolute inset-2 border border-slate-300 pointer-events-none" />
                
                {/* Certificate Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <h5 className="text-[10px] font-bold tracking-widest text-cyan-600 uppercase">WEE HUR CONSTRUCTION PTE LTD</h5>
                    <h6 className="text-xs font-semibold text-slate-500">Singapore Safety & Quality Academy</h6>
                  </div>
                  <Award className="w-10 h-10 text-cyan-500" />
                </div>

                {/* Certificate Core Text */}
                <div className="space-y-4 text-center">
                  <span className="text-xs italic font-medium text-slate-500 block">This certifies that</span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-950 border-b border-slate-200 pb-1 inline-block px-4">
                    {userName}
                  </h3>
                  <span className="text-xs text-slate-500 block">has successfully completed the self-paced professional module</span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 px-6 font-sans">
                    "{tutorial.title}"
                  </h4>
                  <span className="text-xs text-slate-500 block">verifying required safety and operational competence under CONQUAS audit directives.</span>
                </div>

                {/* Certificate Footer */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>ISSUED: 2026-07-07</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>ID: CERT-WH-{tutorial.id.toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Row */}
            <div className="flex justify-center gap-3 pt-4">
              {!passed && (
                <button
                  onClick={handleRestartQuiz}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.tryAgain}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-md cursor-pointer transition-all"
              >
                Return to Modules
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
