/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, BellOff, Calendar, AlertCircle, Check, Trash2, ShieldAlert, Zap } from 'lucide-react';
import { InAppNotification, Language, TRANSLATIONS, VideoTutorial } from '../types';

interface NotificationCenterProps {
  notifications: InAppNotification[];
  tutorials: VideoTutorial[];
  currentLanguage: Language;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onTriggerDeadlineCheck: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  tutorials,
  currentLanguage,
  onMarkRead,
  onClearAll,
  onTriggerDeadlineCheck,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    'tut-1': true,
    'tut-2': false,
    'tut-3': true,
  });

  const toggleReminder = (id: string) => {
    setReminders((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      
      // Visual feedback via native Web Notification if allowed
      if (updated[id] && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Wee Hur Push Notifications', {
          body: `Registered push reminders for training deadline!`,
          icon: '/public/icon.png'
        });
      }
      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Notifications Inbox (Column 1 & 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl lg:col-span-2 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-cyan-400 fill-cyan-400/10" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 w-2.5 h-2.5 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 tracking-tight text-sm">In-App Alert Center</h3>
              <p className="text-xs text-slate-400">Manage real-time push events and automated notifications</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerDeadlineCheck}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.simNotification}</span>
            </button>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-md hover:bg-slate-850 cursor-pointer transition-colors"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-800/50 max-h-[300px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs sm:text-sm">
              <BellOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No unread training alerts or deadline updates.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-3.5 flex items-start gap-3 transition-colors ${
                  notif.read ? 'opacity-60' : 'bg-slate-850/20'
                }`}
              >
                {/* Alert Icon matching Type */}
                <div className={`p-2 rounded-lg border shrink-0 ${
                  notif.type === 'deadline' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  notif.type === 'achievement' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {notif.type === 'deadline' ? <ShieldAlert className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-200 truncate">{notif.title}</p>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                </div>

                {/* Mark as read option */}
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-950/10 hover:bg-emerald-950/30 border border-emerald-900/10 rounded cursor-pointer transition-all shrink-0 ml-2"
                    title="Mark Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Deadlines Checklist (Column 3) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="border-b border-slate-800 pb-4">
          <h3 className="font-extrabold text-slate-100 tracking-tight text-sm flex items-center gap-1.5">
            <Calendar className="w-4.5 h-4.5 text-cyan-400" />
            {t.upcomingDeadlines}
          </h3>
          <p className="text-xs text-slate-400">Toggle automated push reminders</p>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {tutorials.map((tut) => {
            const isRegistered = reminders[tut.id] || false;
            const overdue = new Date(tut.deadline || '') < new Date();
            
            return (
              <div 
                key={tut.id} 
                className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-200 truncate">{tut.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                    <AlertCircle className={`w-3 h-3 ${overdue ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className={overdue ? 'text-red-400 font-bold' : ''}>
                      DUE: {tut.deadline}
                    </span>
                  </div>
                </div>

                {/* Reminder toggle */}
                <button
                  onClick={() => toggleReminder(tut.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer border transition-all shrink-0 ${
                    isRegistered
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-500 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                  }`}
                >
                  {isRegistered ? 'Reminder ON' : 'Remind Me'}
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
