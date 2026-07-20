/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Users, Save, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../types';

interface CollaborativeNotesProps {
  tutorialId: string;
  currentLanguage: Language;
  initialContent: string;
  isOffline: boolean;
  onSaveNotes: (id: string, text: string) => void;
  tutorialTitle?: string;
  tutorialCategory?: string;
  tutorialDescription?: string;
}

export const CollaborativeNotes: React.FC<CollaborativeNotesProps> = ({
  tutorialId,
  currentLanguage,
  initialContent,
  isOffline,
  onSaveNotes,
  tutorialTitle,
  tutorialCategory,
  tutorialDescription,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [content, setContent] = useState(initialContent);
  const [activeUsers, setActiveUsers] = useState<string[]>([
    'Tan Teck Meng (Safety Coordinator)',
    'Siti Aminah (Site Engineer)'
  ]);
  const [userTypingIndicator, setUserTypingIndicator] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // AI Trainer States
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Ref to track typing timer for real-time injection simulation
  const typeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync content when tutorial changes
  useEffect(() => {
    setContent(initialContent);
    setIsSaved(false);
    setUserTypingIndicator(null);
    setAiResult(null);
    setAiError(null);
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current);
    }

    // Set up a simulated collaborator editing sequence to demonstrate real-time capability
    if (!isOffline) {
      const simulateEditing = setTimeout(() => {
        setUserTypingIndicator('Siti Aminah is typing...');
        
        const addedText = '\n\n--- Real-Time Edit by Siti Aminah ---\n⚠️ Reminder: Always inspect the double-lanyard lock pins before stepping onto the cantilever scaffold beams. Keep your safety anchor high!';
        let currentIdx = 0;
        
        typeTimerRef.current = setInterval(() => {
          if (currentIdx < addedText.length) {
            setContent((prev) => prev + addedText.charAt(currentIdx));
            currentIdx++;
          } else {
            if (typeTimerRef.current) clearInterval(typeTimerRef.current);
            setUserTypingIndicator(null);
            setIsSaved(true);
            onSaveNotes(tutorialId, content + addedText);
            
            // Show toast/acknowledgment
            setTimeout(() => setIsSaved(false), 2000);
          }
        }, 50); // Typewriter speed

      }, 8000); // Wait 8 seconds before collaborator joins in editing

      return () => {
        clearTimeout(simulateEditing);
        if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialId, isOffline]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveNotes(tutorialId, content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAiReview = async () => {
    if (isOffline) {
      setAiError('AI Safety Trainer is not available offline.');
      return;
    }
    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const response = await fetch('/api/ai/tutorial-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tutorialTitle || 'Safety Topic',
          category: tutorialCategory || 'General',
          description: tutorialDescription || '',
          studyNotes: content,
          currentLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error response.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiResult(data.text);
    } catch (err: any) {
      console.error('AI review error:', err);
      setAiError(err.message || 'Failed to review with Safety AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[400px]">
        
        {/* Collaborative Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-slate-100 tracking-tight text-sm">
              {t.studyNotes}
            </h3>
          </div>

          {/* Live Collaborators Bubbles */}
          <div className="flex items-center gap-2">
            {!isOffline ? (
              <>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider uppercase">
                  {t.collaboratorsActive} 2 ONLINE
                </span>
              </>
            ) : (
              <span className="text-[10px] text-amber-500 font-mono uppercase">
                📴 Offline (Local Mode)
              </span>
            )}
          </div>
        </div>

        {/* Collaborators list bar */}
        {!isOffline && (
          <div className="bg-slate-950/45 border-b border-slate-800/60 px-5 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Siti Aminah
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Teck Meng
              </span>
            </div>
            {userTypingIndicator && (
              <span className="text-cyan-400 animate-pulse flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {userTypingIndicator}
              </span>
            )}
          </div>
        )}

        {/* Editor Textarea */}
        <div className="relative flex-1 p-1">
          <textarea
            id="collaborative-note-textarea"
            value={content}
            onChange={handleTextChange}
            placeholder={t.writeNotePlaceholder}
            className="w-full h-full bg-transparent text-slate-200 p-4 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
          />
          {/* Glowing cursor simulation during typewriter sync */}
          {userTypingIndicator && (
            <div className="absolute bottom-6 right-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] rounded px-2 py-0.5 font-semibold font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Incoming Collaborative Sync...</span>
            </div>
          )}
        </div>

        {/* Editor Actions Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Last Saved: {new Date().toLocaleTimeString()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAiReview}
              disabled={isAiLoading || isOffline}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                isAiLoading
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800 hover:border-slate-750'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isAiLoading ? 'AI Reviewing...' : 'Review Notes with AI'}</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-550/10'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved Locally</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {(isAiLoading || aiResult || aiError) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 relative overflow-hidden" id="ai-insights-panel">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest font-mono">
                Wee Hur AI Trainer - Study Insights
              </h4>
            </div>
            {(aiResult || aiError) && (
              <button
                onClick={() => { setAiResult(null); setAiError(null); }}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>

          {isAiLoading && (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400 font-medium animate-pulse text-center">
                Safety AI is evaluating your notes and generating Singapore WSH tips...
              </p>
            </div>
          )}

          {aiError && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {aiResult && (
            <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <div className="whitespace-pre-wrap text-slate-300 font-sans prose prose-invert prose-xs">{aiResult}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
