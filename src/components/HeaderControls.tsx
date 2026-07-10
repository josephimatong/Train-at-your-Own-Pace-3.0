/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Shield, Wifi, WifiOff, RefreshCw, User, CheckCircle, Cloud, Menu, X, Sun, Moon, Settings } from 'lucide-react';
import { Language, UserRole, TRANSLATIONS } from '../types';

interface HeaderControlsProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isOffline: boolean;
  toggleOffline: () => void;
  syncQueueLength: number;
  triggerSync: () => void;
  isSyncing: boolean;
  driveUser: any;
  onDriveLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onOpenProfileSettings: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  currentLanguage,
  setLanguage,
  currentRole,
  setRole,
  isOffline,
  toggleOffline,
  syncQueueLength,
  triggerSync,
  isSyncing,
  driveUser,
  onDriveLogout,
  theme,
  setTheme,
  onOpenProfileSettings,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getWelcomeMessage = () => {
    switch (currentRole) {
      case UserRole.SUPER_ADMIN:
        return t.superAdminWelcome;
      case UserRole.ADMIN:
        return t.adminWelcome;
      case UserRole.MANAGER:
        return t.managerWelcome;
      default:
        return t.welcomeUser;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Network Status Bar */}
      <div className={`text-xs text-center py-1.5 px-4 font-semibold tracking-wide transition-colors duration-300 flex items-center justify-center gap-1.5 ${
        isOffline 
          ? 'bg-amber-600 text-amber-50' 
          : 'bg-emerald-600 text-emerald-50'
      }`}>
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.offlineActive}</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>{t.onlineActive}</span>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Header Main Bar */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-white text-lg sm:text-xl">
              WH
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/20 font-bold tracking-wider">
                  v2.0
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">{t.tagline}</p>
            </div>
          </div>

          {/* Desktop/Tablet - Top User Info Details */}
          <div className="hidden md:flex items-center gap-3">
            {/* User Welcome & Quick Info */}
            <div className="flex items-center gap-2.5 bg-slate-950/45 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-semibold leading-tight">{getWelcomeMessage()}</p>
                <p className="text-[9px] text-slate-500 font-mono truncate max-w-[150px]">
                  {driveUser?.email || "josephimatong@weehur.com.sg"}
                </p>
              </div>
              <button
                onClick={onOpenProfileSettings}
                className="ml-1.5 p-1 hover:bg-slate-800 hover:text-white rounded text-slate-400 transition-colors cursor-pointer"
                title="Edit Account Profile & Password"
              >
                <Settings className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            {/* Google Drive Status Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${
              driveUser 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-slate-950/20 border-slate-800 text-slate-400'
            }`}>
              <Cloud className={`w-3.5 h-3.5 ${driveUser ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div className="max-w-[120px] truncate">
                <p className="font-bold text-[8px] uppercase tracking-wider leading-none">Google Drive</p>
                <p className="text-[9px] font-mono truncate leading-normal mt-0.5">
                  {driveUser ? driveUser.email : 'Not Connected'}
                </p>
              </div>
              {driveUser && (
                <button 
                  onClick={onDriveLogout}
                  className="ml-1 text-[9px] bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 font-bold transition-all cursor-pointer"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Mobile Collapsible Trigger Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Toggle Navigation Controls"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
          </button>
        </div>

        {/* Desktop/Tablet - Inline controls underneath */}
        <div className="hidden md:flex items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-850/60">
          <div className="flex items-center gap-3.5">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value={Language.EN}>English (EN)</option>
                <option value={Language.ZH}>中文 (ZH)</option>
                <option value={Language.MS}>Melayu (MS)</option>
                <option value={Language.TA}>தமிழ் (TA)</option>
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-md px-2 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value={UserRole.EMPLOYEE}>Employee View</option>
                <option value={UserRole.MANAGER}>Team Manager View</option>
                <option value={UserRole.ADMIN}>Administrator View</option>
                <option value={UserRole.SUPER_ADMIN}>Super Admin View</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-xs px-3 py-1.5 rounded-md font-medium border border-slate-800 bg-slate-950/45 text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
              title={theme === 'light' ? 'Switch to Slate Dark' : 'Switch to Classic Light'}
            >
              {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{theme === 'light' ? 'Classic Light' : 'Slate Dark'}</span>
            </button>

            {/* Network / Offline Toggle */}
            <button
              id="offline-toggle"
              onClick={toggleOffline}
              className={`text-xs px-3 py-1.5 rounded-md font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                isOffline
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              {t.offlineMode}: {isOffline ? 'OFF' : 'ON'}
            </button>

            {/* Synchronization Trigger (Online Only) */}
            {!isOffline && (
              <button
                id="sync-trigger"
                onClick={triggerSync}
                disabled={isSyncing}
                className="relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md border border-cyan-500/30 flex items-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
                {syncQueueLength > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-bounce">
                    {syncQueueLength}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile View - Expandable Menu Section */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3.5 border-t border-slate-800 space-y-4 animate-in slide-in-from-top-3 duration-200">
            {/* Mobile User Info details */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">{getWelcomeMessage()}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {driveUser?.email || "josephimatong@weehur.com.sg"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenProfileSettings();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 rounded-md border border-cyan-500/20 font-bold transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

            {/* Mobile Google Drive Integration */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              driveUser 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                : 'bg-slate-950 border-slate-850 text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <Cloud className={`w-4 h-4 ${driveUser ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-[8px] uppercase tracking-wider leading-none">Google Drive Sync</p>
                  <p className="text-[10px] font-mono truncate max-w-[160px] mt-0.5">
                    {driveUser ? driveUser.email : 'Not Connected'}
                  </p>
                </div>
              </div>
              {driveUser && (
                <button 
                  onClick={onDriveLogout}
                  className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1 rounded border border-red-500/20 font-bold transition-all cursor-pointer"
                >
                  Disconnect
                </button>
              )}
            </div>

            {/* Selectors and Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Language Selector */}
              <div className="space-y-1">
                <label htmlFor="language-select-mobile" className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Language</label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    id="language-select-mobile"
                    value={currentLanguage}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={Language.EN}>English</option>
                    <option value={Language.ZH}>中文</option>
                    <option value={Language.MS}>Melayu</option>
                    <option value={Language.TA}>தமிழ்</option>
                  </select>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-1">
                <label htmlFor="role-select-mobile" className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Simulated Role</label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    id="role-select-mobile"
                    value={currentRole}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer font-medium"
                  >
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Network Toggle & Sync (Mobile) */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-3">
                <button
                  id="offline-toggle-mobile"
                  onClick={toggleOffline}
                  className={`flex-1 text-xs py-2 px-3 rounded-lg font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isOffline
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{t.offlineMode}: {isOffline ? 'OFF' : 'ON'}</span>
                </button>

                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="flex-1 text-xs py-2 px-3 rounded-lg font-bold border border-slate-800 bg-slate-950/65 text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-slate-900"
                >
                  {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{theme === 'light' ? 'Classic Light' : 'Slate Dark'}</span>
                </button>
              </div>

              {!isOffline && (
                <button
                  id="sync-trigger-mobile"
                  onClick={() => {
                    triggerSync();
                    setIsMenuOpen(false); // Close menu on sync
                  }}
                  disabled={isSyncing}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg border border-cyan-500/30 flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Cloud</span>
                  {syncQueueLength > 0 && (
                    <span className="bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                      {syncQueueLength}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
