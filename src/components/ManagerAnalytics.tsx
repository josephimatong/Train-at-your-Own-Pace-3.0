/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  Lock, 
  Terminal, 
  RefreshCw, 
  AlertTriangle,
  Download,
  Award
} from 'lucide-react';
import { SITE_ANALYTICS, COMPLETION_TRENDS } from '../data';
import { Language, TRANSLATIONS, SyncLogEntry, VideoTutorial } from '../types';

interface ManagerAnalyticsProps {
  currentLanguage: Language;
  tutorials: VideoTutorial[];
}

export const ManagerAnalytics: React.FC<ManagerAnalyticsProps> = ({ currentLanguage, tutorials }) => {
  const t = TRANSLATIONS[currentLanguage];
  
  // Calculate category usage and popularity dynamically from tutorials list
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, { total: number; completed: number; xp: number; clicks: number }> = {
      'HR-Onboarding Track': { total: 0, completed: 0, xp: 0, clicks: 142 },
      'Safety Track': { total: 0, completed: 0, xp: 0, clicks: 184 },
      'Technical Track': { total: 0, completed: 0, xp: 0, clicks: 115 },
      'BIM & Integrated Digital Delivery (BIM-IDD) Track': { total: 0, completed: 0, xp: 0, clicks: 98 },
      'Operation Track': { total: 0, completed: 0, xp: 0, clicks: 110 },
    };

    // Aggregate from active training tutorials in the app
    tutorials.forEach((tut) => {
      const cat = tut.category || 'Other';
      if (!stats[cat]) {
        stats[cat] = { total: 0, completed: 0, xp: 0, clicks: 15 };
      }
      stats[cat].total += 1;
      if (tut.quizPassed) {
        stats[cat].completed += 1;
      }
      stats[cat].xp += tut.xpValue;
    });

    return Object.keys(stats).map((catName) => ({
      category: catName,
      modulesCount: stats[catName].total,
      completedCount: stats[catName].completed,
      clicksCount: stats[catName].clicks,
      totalXp: stats[catName].xp,
      // Usage Index represents a weighted calculation of user clicks and quiz completions
      usageIndex: stats[catName].clicks + (stats[catName].completed * 45),
    })).sort((a, b) => b.usageIndex - a.usageIndex);
  }, [tutorials]);

  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([
    { timestamp: '2026-07-07 09:12:05', type: 'info', message: 'Cryptographic sync engine loaded. Ready to secure payloads.' },
    { timestamp: '2026-07-07 09:12:08', type: 'success', message: 'System handshake completed. SSL keys authorized with Wee Hur server.' }
  ]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);

  const triggerSecureSync = () => {
    setIsEncrypting(true);
    setSyncProgress(0);
    
    const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setSyncLogs((prev) => [...prev, { timestamp, type, message }]);
    };

    addLog('Initiating secure audit sync. Packaging sensitive employee certification indexes...', 'info');

    // Multi-stage encrypted sync animation simulation
    setTimeout(() => {
      setSyncProgress(25);
      addLog('Hashing dataset using SHA-256. Verification digest: d57e1b29a8f4c10c3f58e6...', 'info');
    }, 1000);

    setTimeout(() => {
      setSyncProgress(50);
      const generatedKey = Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      addLog(`Generating secure 256-bit symmetric session key: ${generatedKey}`, 'success');
      addLog('Encrypting data blocks with AES-GCM (Galois/Counter Mode)...', 'info');
    }, 2000);

    setTimeout(() => {
      setSyncProgress(75);
      addLog('Opening secure TLS 1.3 socket to central server: https://records-sync.weehur.com.sg/api/v2/push', 'info');
      addLog('Uploading encrypted block packages... Chunk 1/1 [12.4 KB] sent.', 'success');
    }, 3200);

    setTimeout(() => {
      setSyncProgress(100);
      setIsEncrypting(false);
      addLog('Central server decrypted signature matching index verified. Synchronization success!', 'success');
      setSyncProgress(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      
      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Avg Completion Rate</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">82.4%</h4>
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <span>▲ +3.2% vs last month</span>
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Active Trainees</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">148</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Across 5 Singapore sites</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Total Training Hours</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">1,420h</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Self-paced modules watched</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Safety Non-Compliance</p>
            <h4 className="text-2xl font-black text-slate-100 font-mono">6</h4>
            <p className="text-[10px] text-red-400 font-bold mt-0.5">Overdue safety deadlines</p>
          </div>
        </div>

      </div>

      {/* Interactive Charts Panel (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Completion rates by site */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            {t.completionBySite} (%)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SITE_ANALYTICS}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend style={{ fontSize: '11px' }} />
                <Bar dataKey="completion" name="Module Completion %" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                  {SITE_ANALYTICS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#0891b2'} />
                  ))}
                </Bar>
                <Bar dataKey="compliance" name="Site Compliance Score %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Completion Trends over Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Overall Module Completions (Month-on-Month)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={COMPLETION_TRENDS}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '10px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend style={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Completed" stroke="#06b6d4" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Target" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Category Usage & Popularity Analytics Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Training Category Usage & Popularity Dashboard
            </h3>
            <p className="text-xs text-slate-400">Insight on commonly used training categories, active modules, and estimated user engagement</p>
          </div>
          <div className="text-xs font-mono font-bold bg-purple-500/10 text-purple-400 px-3 py-1 border border-purple-500/20 rounded-full">
            {categoryStats.length} Active Categories
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Left */}
          <div className="lg:col-span-2 bg-slate-950/45 border border-slate-850 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-mono">
              Category Engagement & Click Index
            </h4>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryStats}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" style={{ fontSize: '10px' }} />
                  <YAxis dataKey="category" type="category" stroke="#64748b" style={{ fontSize: '10px' }} tickFormatter={(val) => t[val] || val} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend style={{ fontSize: '11px' }} />
                  <Bar dataKey="clicksCount" name="Estimated Views / Clicks" fill="#a855f7" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="usageIndex" name="Engagement Score" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Right */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              Most Commonly Used Categories
            </h4>
            <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
              {categoryStats.map((stat, idx) => (
                <div key={stat.category} className="bg-slate-950/30 border border-slate-850 p-3 rounded-lg flex flex-col gap-1.5 hover:border-slate-800 transition-all">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-200 flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] text-purple-400 font-mono">#{idx+1}</span>
                      {t[stat.category] || stat.category}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                      {stat.totalXp} XP Available
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{stat.modulesCount} modules • {stat.completedCount} completed</span>
                    <span className="text-slate-500">Views: <span className="text-slate-300 font-bold font-mono">{stat.clicksCount}</span></span>
                  </div>
                  <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full" 
                      style={{ width: `${stat.modulesCount > 0 ? (stat.completedCount / stat.modulesCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Encrypted Data Synchronization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Lock className="w-32 h-32 text-white" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-cyan-400" />
              {t.sensitiveSync}
            </h3>
            <p className="text-xs text-slate-400">Encrypts and transmits sensitive certification, licensing and compliance indexes securely</p>
          </div>
          <button
            onClick={triggerSecureSync}
            disabled={isEncrypting}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isEncrypting ? 'animate-spin' : ''}`} />
            <span>{isEncrypting ? 'Encrypting & Syncing...' : t.syncNow}</span>
          </button>
        </div>

        {/* Sync Progress Bar */}
        {syncProgress !== null && (
          <div className="mb-4 bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-300 font-mono font-bold mb-1.5">
              <span>SECURE SSL CODER LOAD</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-350" 
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Terminal Sync Logs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5" />
            {t.syncLogs}
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[11px] sm:text-xs leading-relaxed max-h-[160px] overflow-y-auto space-y-1.5 shadow-inner">
            {syncLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold ${
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'warning' ? 'text-amber-500' :
                  log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {log.type.toUpperCase()}:
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
