/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Check, 
  Loader2, 
  ArrowUpRight, 
  ShieldCheck, 
  Database, 
  RefreshCw,
  Search,
  FileText,
  ExternalLink,
  Save,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { CloudStorageConfig, Language, TRANSLATIONS, VideoTutorial } from '../types';
import { listDriveFiles, uploadDriveFile } from '../lib/driveAuth';
import { User } from 'firebase/auth';

interface CloudStorageSyncProps {
  currentLanguage: Language;
  driveUser: User | null;
  onDriveLogin: () => Promise<void>;
  onDriveLogout: () => Promise<void>;
  studyNotes: Record<string, string>;
  tutorials: VideoTutorial[];
}

export const CloudStorageSync: React.FC<CloudStorageSyncProps> = ({ 
  currentLanguage,
  driveUser,
  onDriveLogin,
  onDriveLogout,
  studyNotes,
  tutorials
}) => {
  const t = TRANSLATIONS[currentLanguage];
  
  // Storage configs
  const [configs, setConfigs] = useState<CloudStorageConfig[]>([
    { id: 'cloud-1', service: 'Google Drive', connected: false },
    { id: 'cloud-2', service: 'OneDrive', connected: false },
    { id: 'cloud-3', service: 'AWS S3', connected: true, accountEmail: 's3://weehur-learning-bucket', lastSync: '2026-07-06 18:30' }
  ]);

  const [linkingService, setLinkingService] = useState<string | null>(null);

  // File explorer states (Google Drive)
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [explorerError, setExplorerError] = useState<string | null>(null);

  // Note export states
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>('');
  const [exportFileName, setExportFileName] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFileLink, setExportedFileLink] = useState<string | null>(null);

  // Sync Google Drive config connected status with driveUser prop and presence of Google Drive access token
  useEffect(() => {
    const hasDriveToken = !!sessionStorage.getItem('weehur_drive_token');
    setConfigs(prev => prev.map(c => {
      if (c.service === 'Google Drive') {
        return {
          ...c,
          connected: !!driveUser && hasDriveToken,
          accountEmail: (driveUser && hasDriveToken) ? driveUser.email || undefined : undefined,
          lastSync: (driveUser && hasDriveToken) ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        };
      }
      return c;
    }));

    if (driveUser && hasDriveToken) {
      fetchFiles();
      // Set default tutorial notes for export if available
      const notesKeys = Object.keys(studyNotes);
      if (notesKeys.length > 0 && !selectedTutorialId) {
        setSelectedTutorialId(notesKeys[0]);
        const tut = tutorials.find(t => t.id === notesKeys[0]);
        if (tut) {
          setExportFileName(`${tut.title.replace(/\s+/g, '_')}_Notes.txt`);
        }
      }
    } else {
      setDriveFiles([]);
    }
  }, [driveUser, studyNotes, tutorials]);

  // Handle selected tutorial change for note export filename
  useEffect(() => {
    if (selectedTutorialId) {
      const tut = tutorials.find(t => t.id === selectedTutorialId);
      if (tut) {
        setExportFileName(`${tut.title.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.txt`);
      }
    }
  }, [selectedTutorialId]);

  const fetchFiles = async (query?: string) => {
    if (!driveUser) return;
    setIsLoadingFiles(true);
    setExplorerError(null);
    try {
      const files = await listDriveFiles(query);
      setDriveFiles(files);
    } catch (err: any) {
      setExplorerError('Failed to retrieve files from Google Drive. Ensure scopes are approved.');
      console.error(err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const handleToggleConnect = async (id: string, service: string) => {
    const config = configs.find((c) => c.id === id);
    if (!config) return;

    if (config.connected) {
      if (service === 'Google Drive') {
        const confirmed = window.confirm('Are you sure you want to disconnect Google Drive?');
        if (!confirmed) return;
        setLinkingService(service);
        try {
          await onDriveLogout();
        } finally {
          setLinkingService(null);
        }
      } else {
        // Simple simulator for S3 / OneDrive
        setConfigs((prev) =>
          prev.map((c) => (c.id === id ? { ...c, connected: false, accountEmail: undefined, lastSync: undefined } : c))
        );
      }
    } else {
      setLinkingService(service);
      if (service === 'Google Drive') {
        try {
          await onDriveLogin();
        } catch (err) {
          alert('Failed to connect with Google Drive. Please try again.');
        } finally {
          setLinkingService(null);
        }
      } else {
        // Simulate OAuth link authorization spinner for others
        setTimeout(() => {
          setConfigs((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    connected: true,
                    accountEmail: service === 'OneDrive' ? 'management-onedrive@weehur.com.sg' : 's3://weehur-learning-bucket',
                    lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  }
                : c
            )
          );
          setLinkingService(null);
        }, 1200);
      }
    }
  };

  const handleExportNote = async () => {
    if (!selectedTutorialId || !exportFileName.trim()) return;
    const noteText = studyNotes[selectedTutorialId];
    if (!noteText) {
      alert('Selected module does not contain any study notes to export.');
      return;
    }

    setIsExporting(true);
    setExportedFileLink(null);

    try {
      const fileId = await uploadDriveFile(exportFileName, noteText);
      setExportedFileLink(`https://docs.google.com/file/d/${fileId}/edit`);
      // Re-fetch files list
      await fetchFiles();
    } catch (err: any) {
      alert(`Export to Google Drive failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      
      {/* Absolute background card accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Cloud className="w-5 h-5 text-cyan-400" />
          {t.cloudStorage}
        </h3>
        <p className="text-xs text-slate-400">Link external storage environments to auto-import video courses or sync safety compliance audits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {configs.map((config) => {
          const isLinking = linkingService === config.service;
          
          return (
            <div
              key={config.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                config.connected
                  ? 'bg-slate-950 border-emerald-500/20 shadow-inner'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className={`w-5 h-5 ${config.connected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-xs sm:text-sm font-bold text-slate-200">{config.service}</span>
                  </div>
                  {config.connected && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono uppercase tracking-wider">
                      CONNECTED
                    </span>
                  )}
                </div>

                {config.connected ? (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 font-mono truncate">{config.accountEmail}</p>
                    <p className="text-[10px] text-slate-500">Last Synced: {config.lastSync}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Import training video tutorials directly from your shared {config.service} folders.
                  </p>
                )}
              </div>

              {/* Connection Button */}
              <button
                type="button"
                onClick={() => handleToggleConnect(config.id, config.service)}
                disabled={isLinking}
                className={`w-full text-xs font-bold py-2 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isLinking
                    ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                    : config.connected
                    ? 'bg-slate-900 hover:bg-slate-850 text-red-400 border-red-500/20 hover:border-red-500/30'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-500/20 shadow-md shadow-cyan-500/10'
                }`}
              >
                {isLinking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>OAuth Handshake...</span>
                  </>
                ) : config.connected ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.disconnect}</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{t.connect}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Google Drive Integrated Workspace */}
      {driveUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          
          {/* File Explorer Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black text-slate-200 tracking-tight">Google Drive File Explorer</h4>
              </div>
              <button 
                onClick={() => fetchFiles()}
                disabled={isLoadingFiles}
                className="text-[10px] text-cyan-400 font-bold bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 hover:border-cyan-500/20 px-2 py-1 rounded transition-colors"
              >
                Refresh List
              </button>
            </div>

            {/* Search Files form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                id="drive-file-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files in Google Drive..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-16 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                Search
              </button>
            </form>

            {/* Live Files Display */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {isLoadingFiles ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-500 text-xs">
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span>Scanning Google Drive files...</span>
                </div>
              ) : explorerError ? (
                <p className="text-center py-10 text-red-400 text-xs font-semibold">{explorerError}</p>
              ) : driveFiles.length > 0 ? (
                driveFiles.map((file) => (
                  <div key={file.id} className="bg-slate-900 border border-slate-850 hover:border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs gap-3 transition-colors">
                    <div className="min-w-0 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-slate-300 truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono">
                          {file.mimeType.split('.').pop()?.toUpperCase() || 'FILE'} • {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Folder/Stream'}
                        </p>
                      </div>
                    </div>
                    {file.webViewLink && (
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors border border-slate-700/50"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <p className="font-semibold">No files found.</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Use the export widget next door to create files!</p>
                </div>
              )}
            </div>
          </div>

          {/* Export Notes Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-4 shadow-inner flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-black text-slate-200 tracking-tight">Export Study Notes to Drive</h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Save your collaborative safety findings and notes as real documents inside Google Drive for field operations and off-site inspections.
              </p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="export-tut-select" className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Safety Module</label>
                  <select
                    id="export-tut-select"
                    value={selectedTutorialId}
                    onChange={(e) => setSelectedTutorialId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    {Object.keys(studyNotes).map((tutId) => {
                      const tut = tutorials.find(t => t.id === tutId);
                      return (
                        <option key={tutId} value={tutId}>
                          {tut ? tut.title : `Module: ${tutId}`}
                        </option>
                      );
                    })}
                    {Object.keys(studyNotes).length === 0 && (
                      <option value="">No notes available to export</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="export-file-name" className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Google Drive File Name</label>
                  <input
                    id="export-file-name"
                    type="text"
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="FileName.txt"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Success feedback */}
            {exportedFileLink && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-[11px] text-emerald-300 flex items-center justify-between gap-3 animate-fade-in my-3">
                <div className="min-w-0">
                  <p className="font-bold">Export Complete!</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{exportFileName} saved successfully.</p>
                </div>
                <a 
                  href={exportedFileLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <span>View Doc</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={handleExportNote}
              disabled={isExporting || !selectedTutorialId}
              className={`w-full font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 border cursor-pointer transition-all mt-4 ${
                isExporting 
                  ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/10 text-white shadow-md shadow-emerald-500/10'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing document to Google Drive...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Export Note to Google Drive</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
