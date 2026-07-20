/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, UserRole } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SafetyChatbotProps {
  currentLanguage: Language;
  currentRole: UserRole;
}

const PRESETS: Record<Language, string[]> = {
  [Language.EN]: [
    "How do I use this training hub app?",
    "What training modules are available in Wee Hur?",
    "Give me a positive message or safety encouragement!",
    "How do I earn badges and level up my XP?"
  ],
  [Language.ZH]: [
    "我该如何使用这个培训中心应用？",
    "伟合有哪些可用的培训模块？",
    "给我一句充满正能量的鼓励或安全寄语！",
    "我该如何获得徽章和提升我的 XP 经验值？"
  ],
  [Language.MS]: [
    "Bagaimanakah saya menggunakan aplikasi hub latihan ini?",
    "Apakah modul latihan yang tersedia di Wee Hur?",
    "Berikan saya mesej positif atau galakan keselamatan!",
    "Bagaimana saya boleh mendapatkan lencana dan naik tahap XP?"
  ],
  [Language.TA]: [
    "இந்த பயிற்சி மைய செயலியை நான் எவ்வாறு பயன்படுத்துவது?",
    "வீ ஹரில் என்னென்ன பயிற்சி தொகுப்புகள் கிடைக்கின்றன?",
    "எனக்கு ஒரு நேர்மறையான செய்தி அல்லது பாதுகாப்பு ஊக்கம் கொடுங்கள்!",
    "நான் எவ்வாறு பேட்ஜ்களைப் பெற்று எனது எக்ஸ்பியை உயர்த்துவது?"
  ]
};

const UI_TEXT: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    assistantTitle: "WH Friendly Assistant",
    assistantSubtitle: "Your Friendly App Guide & Positive Motivator",
    placeholder: "Ask me how to use the app, find training topics...",
    welcome: "Hello there! I am WH Friendly Assistant, your positive, friendly guide for the Wee Hur Training Hub! 🌟\n\nI am here to help you master this app, explore our amazing training modules (like Safety, QAQC, and PPVC), and cheer you on with positive vibes! Keep up the safe work!",
    offlineWarning: "WH Friendly Assistant is offline. Reconnect to chat.",
    errorOccurred: "An error occurred. Please try again."
  },
  [Language.ZH]: {
    assistantTitle: "WH 友好助手",
    assistantSubtitle: "您的应用友好导览与正能量激励师",
    placeholder: "询问我如何使用应用、查找培训主题...",
    welcome: "您好！我是 WH 友好助手 (WH Friendly Assistant)，您在伟合培训中心的友好正能量导游！🌟\n\n我在这里帮助您掌握这款应用、探索精彩的培训模块（如安全、质检、预制装配），并用满满的正能量为您加油打气！安全施工，快乐工作！",
    offlineWarning: "WH 友好助手已离线。请恢复网络以开始聊天。",
    errorOccurred: "发生错误，请重试。"
  },
  [Language.MS]: {
    assistantTitle: "Pembantu WH Friendly",
    assistantSubtitle: "Panduan Mesra Aplikasi & Motivator Positif Anda",
    placeholder: "Tanya saya cara guna aplikasi, cari topik latihan...",
    welcome: "Helo semua! Saya Pembantu WH Friendly, panduan mesra dan positif anda untuk Wee Hur Training Hub! 🌟\n\nSaya di sini untuk membantu anda menguasai aplikasi ini, meneroka modul latihan kami yang hebat (seperti Keselamatan, QAQC, dan PPVC), dan memberi anda semangat dengan aura positif! Teruskan kerja selamat!",
    offlineWarning: "Pembantu WH Friendly berada di luar talian. Sambung semula untuk berbual.",
    errorOccurred: "Ralat berlaku. Sila cuba lagi."
  },
  [Language.TA]: {
    assistantTitle: "WH நட்பு உதவியாளர்",
    assistantSubtitle: "உங்களின் அன்பான வழிகாட்டி & நேர்மறை ஊக்கமளிப்பவர்",
    placeholder: "செயலியைப் பயன்படுத்துவது, பயிற்சி தலைப்புகளைக் கண்டறிவது பற்றி கேட்கவும்...",
    welcome: "வணக்கம்! நான் WH நட்பு உதவியாளர் (WH Friendly Assistant). வீ ஹர் பயிற்சி மையத்திற்கான உங்களின் அன்பான நேர்மறை வழிகாட்டி! 🌟\n\nஇந்தச் செயலியை மாஸ்டர் செய்யவும், எங்களது சிறந்த பயிற்சி தொகுப்புகளை (பாதுகாப்பு, QAQC மற்றும் PPVC போன்றவை) ஆராயவும் மற்றும் உங்களுக்கு நேர்மறையான ஆற்றலை அளித்து ஊக்கப்படுத்தவும் நான் இங்கு இருக்கிறேன்! பாதுகாப்பாக தொடர்ந்து பணியாற்றுங்கள்!",
    offlineWarning: "WH நட்பு உதவியாளர் ஆஃப்லைனில் உள்ளார். அரட்டைக்கு மீண்டும் இணையவும்.",
    errorOccurred: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
  }
};

export const SafetyChatbot: React.FC<SafetyChatbotProps> = ({ currentLanguage, currentRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXT[currentLanguage] || UI_TEXT[Language.EN];
  const presets = PRESETS[currentLanguage] || PRESETS[Language.EN];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t.welcome
        }
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const driveToken = sessionStorage.getItem('weehur_drive_token') || undefined;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          userRole: currentRole,
          currentLanguage,
          driveToken
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.text || 'No response.' }]);
    } catch (err: any) {
      console.error('Failed to chat:', err);
      setError(t.errorOccurred);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${t.errorOccurred}: ${err.message || ''}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/20 text-white cursor-pointer relative border border-cyan-400/20`}
        id="safety-ai-chat-btn"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-slate-900"></span>
        </span>
      </motion.button>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            className="absolute bottom-20 right-0 w-[360px] sm:w-[400px] h-[550px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
            id="safety-ai-chat-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-100 tracking-wider flex items-center gap-1">
                    {t.assistantTitle}
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium font-sans leading-none mt-0.5">{t.assistantSubtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0 text-xs">
                      WH
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Preserve line breaks and bold keywords */}
                    <p className="whitespace-pre-line text-xs font-sans">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-slate-800 text-slate-300 border border-slate-750 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0 text-xs">
                    WH
                  </div>
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Preset Help Chips */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-3 space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suggested Questions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {presets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(preset)}
                        className="text-left bg-slate-900 hover:bg-slate-850 text-slate-300 font-sans hover:text-cyan-400 border border-slate-850 rounded-xl px-3 py-2 text-xs transition-all cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap shadow-sm"
                      >
                        💡 {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-850 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder={t.placeholder}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-sans disabled:opacity-55"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-md border border-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
