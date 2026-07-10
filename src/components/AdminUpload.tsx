/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Video, HelpCircle, Check, Trash2, ArrowUpCircle, Film, Sparkles, UploadCloud, FileVideo, AlertTriangle, X, Search, Loader2, Cloud, FolderOpen } from 'lucide-react';
import { VideoTutorial, QuizQuestion, Language, TRANSLATIONS, UserRole } from '../types';
import { listDriveFiles } from '../lib/driveAuth';
import { User } from 'firebase/auth';
import { TRAINING_CATALOG, TrackData } from '../categoryData';

interface AdminUploadProps {
  currentLanguage: Language;
  onPublishTutorial: (tutorial: VideoTutorial, questions: QuizQuestion[]) => void;
  driveUser: User | null;
  currentRole?: UserRole;
  trainingCatalog?: TrackData[];
  onUpdateCatalog?: (newCatalog: TrackData[]) => void;
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ 
  currentLanguage, 
  onPublishTutorial, 
  driveUser,
  currentRole = UserRole.EMPLOYEE,
  trainingCatalog,
  onUpdateCatalog
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const catalog = trainingCatalog || TRAINING_CATALOG;

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(catalog[0]?.name || '');
  const [selectedModule, setSelectedModule] = useState(catalog[0]?.modules[0]?.title || '');
  const [selectedTopic, setSelectedTopic] = useState(
    catalog[0]?.modules[0]?.topics[0]
      ? `Topic ${catalog[0].modules[0].topics[0].code}: ${catalog[0].modules[0].topics[0].title}`
      : ''
  );
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('05:00');
  const [xpValue, setXpValue] = useState(150);
  const [cloudSource, setCloudSource] = useState('local');

  // Sub-tab toggling for AdminUpload
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'upload' | 'curriculum'>('upload');

  // Curriculum Management states
  const [selectedCurriculumTrack, setSelectedCurriculumTrack] = useState(catalog[0]?.name || '');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [targetModuleForTopic, setTargetModuleForTopic] = useState('');
  const [newTopicCode, setNewTopicCode] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleCurriculumTrackChange = (trackName: string) => {
    setSelectedCurriculumTrack(trackName);
    const track = catalog.find(t => t.name === trackName);
    if (track && track.modules.length > 0) {
      setTargetModuleForTopic(track.modules[0].title);
    } else {
      setTargetModuleForTopic('');
    }
  };

  const handleAddModule = (trackName: string, moduleTitle: string) => {
    if (!onUpdateCatalog) return;
    if (!moduleTitle.trim()) {
      setErrorMsg('Please enter a valid module title.');
      return;
    }
    
    // Check if module already exists in this track
    const track = catalog.find(t => t.name === trackName);
    if (track?.modules.some(m => m.title.toLowerCase() === moduleTitle.trim().toLowerCase())) {
      setErrorMsg(`Module "${moduleTitle}" already exists in ${trackName}.`);
      return;
    }

    const updatedCatalog = catalog.map(t => {
      if (t.name === trackName) {
        return {
          ...t,
          modules: [
            ...t.modules,
            {
              title: moduleTitle.trim(),
              topics: []
            }
          ]
        };
      }
      return t;
    });

    onUpdateCatalog(updatedCatalog);
    setNewModuleTitle('');
    setSuccessMsg(`Successfully added module "${moduleTitle}" to ${trackName}!`);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleAddTopic = (trackName: string, moduleTitle: string, topicCode: string, topicTitle: string) => {
    if (!onUpdateCatalog) return;
    if (!moduleTitle) {
      setErrorMsg('Please select a target module first.');
      return;
    }
    if (!topicCode.trim() || !topicTitle.trim()) {
      setErrorMsg('Please fill in both the Topic Code (e.g. 1.11) and Topic Title.');
      return;
    }

    // Check if topic code already exists in this module
    const track = catalog.find(t => t.name === trackName);
    const mod = track?.modules.find(m => m.title === moduleTitle);
    if (mod?.topics.some(t => t.code === topicCode.trim())) {
      setErrorMsg(`Topic code "${topicCode}" already exists in the selected module.`);
      return;
    }

    const updatedCatalog = catalog.map(t => {
      if (t.name === trackName) {
        return {
          ...t,
          modules: t.modules.map(m => {
            if (m.title === moduleTitle) {
              return {
                ...m,
                topics: [
                  ...m.topics,
                  {
                    code: topicCode.trim(),
                    title: topicTitle.trim()
                  }
                ]
              };
            }
            return m;
          })
        };
      }
      return t;
    });

    onUpdateCatalog(updatedCatalog);
    setNewTopicCode('');
    setNewTopicTitle('');
    setSuccessMsg(`Successfully added Topic ${topicCode}: ${topicTitle} to ${moduleTitle}!`);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRemoveModule = (trackName: string, moduleTitle: string) => {
    if (!onUpdateCatalog) return;
    if (!window.confirm(`Are you sure you want to delete the module "${moduleTitle}"? This will also delete all associated topics in this module.`)) {
      return;
    }

    const updatedCatalog = catalog.map(t => {
      if (t.name === trackName) {
        return {
          ...t,
          modules: t.modules.filter(m => m.title !== moduleTitle)
        };
      }
      return t;
    });

    onUpdateCatalog(updatedCatalog);
    setSuccessMsg(`Deleted module "${moduleTitle}" and its topics.`);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRemoveTopic = (trackName: string, moduleTitle: string, topicCode: string) => {
    if (!onUpdateCatalog) return;
    const updatedCatalog = catalog.map(t => {
      if (t.name === trackName) {
        return {
          ...t,
          modules: t.modules.map(m => {
            if (m.title === moduleTitle) {
              return {
                ...m,
                topics: m.topics.filter(topic => topic.code !== topicCode)
              };
            }
            return m;
          })
        };
      }
      return t;
    });

    onUpdateCatalog(updatedCatalog);
    setSuccessMsg(`Deleted topic code ${topicCode}.`);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const track = catalog.find(t => t.name === newCat);
    if (track && track.modules.length > 0) {
      const firstMod = track.modules[0];
      setSelectedModule(firstMod.title);
      if (firstMod.topics.length > 0) {
        const firstTopic = firstMod.topics[0];
        setSelectedTopic(`Topic ${firstTopic.code}: ${firstTopic.title}`);
      } else {
        setSelectedTopic('');
      }
    } else {
      setSelectedModule('');
      setSelectedTopic('');
    }
  };

  const handleModuleChange = (newMod: string) => {
    setSelectedModule(newMod);
    const track = catalog.find(t => t.name === category);
    const mod = track?.modules.find(m => m.title === newMod);
    if (mod && mod.topics.length > 0) {
      const firstTopic = mod.topics[0];
      setSelectedTopic(`Topic ${firstTopic.code}: ${firstTopic.title}`);
    } else {
      setSelectedTopic('');
    }
  };

  // Google Drive File Picker States
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isSearchingDrive, setIsSearchingDrive] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [showDrivePicker, setShowDrivePicker] = useState(false);

  const fetchDriveFiles = async (query?: string) => {
    if (!driveUser) return;
    setIsSearchingDrive(true);
    try {
      const files = await listDriveFiles(query);
      setDriveFiles(files);
    } catch (err) {
      console.error('Failed to load drive files in AdminUpload', err);
    } finally {
      setIsSearchingDrive(false);
    }
  };

  const handleSelectDriveFile = (file: any) => {
    setVideoUrl(file.webContentLink || file.webViewLink || `https://docs.google.com/file/d/${file.id}/edit`);
    setVideoFileName(`[Google Drive] ${file.name}`);
    setVideoFileSize(file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'Cloud Stream');
    setCloudSource('Google Drive');
    
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .split(/[-_]+/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setTitle(cleanName);
    }
    setShowDrivePicker(false);
  };

  // Drag and drop video upload states
  const [isDragging, setIsDragging] = useState(false);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [videoFileSize, setVideoFileSize] = useState<string | null>(null);

  // Quiz Creator state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Notification feedback
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill out the question and all 4 option slots before adding.');
      return;
    }

    const newQuestion: QuizQuestion = {
      id: `q-custom-${Date.now()}-${questions.length}`,
      question: currentQuestion,
      options: [...options],
      correctIndex: correctIdx,
      explanation: explanation || 'Refer to the video tutorial guidelines for the correct response.'
    };

    setQuestions((prev) => [...prev, newQuestion]);

    // Reset single question builder
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectIdx(0);
    setExplanation('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const processVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMsg('Selected file must be a valid video (MP4, WEBM, etc.).');
      return;
    }
    setErrorMsg(null);
    try {
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setVideoFileName(file.name);
      
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setVideoFileSize(`${sizeMB} MB`);

      // Auto-fill title if empty or standard
      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "") // strip extension
          .split(/[-_]+/) // split by dashes/underscores
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
          .join(" ");
        setTitle(cleanName);
      }
    } catch (err) {
      setErrorMsg('Failed to process video file. Please try another file or specify a direct link.');
    }
  };

  const clearVideoFile = () => {
    setVideoUrl('');
    setVideoFileName(null);
    setVideoFileSize(null);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please specify a title for the tutorial.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please write a brief description of the tutorial.');
      return;
    }
    if (!videoUrl.trim()) {
      setErrorMsg('Please upload a video file or provide a valid streaming video URL.');
      return;
    }

    let finalQuestions = [...questions];

    // Auto-add question if user typed one but forgot to click the "Add Question" button
    if (currentQuestion.trim() && options.every(opt => opt.trim())) {
      const newQuestion: QuizQuestion = {
        id: `q-custom-${Date.now()}-auto`,
        question: currentQuestion,
        options: [...options],
        correctIndex: correctIdx,
        explanation: explanation || 'Refer to the video tutorial guidelines for the correct response.'
      };
      finalQuestions.push(newQuestion);
      // clear the builder fields
      setCurrentQuestion('');
      setOptions(['', '', '', '']);
      setCorrectIdx(0);
      setExplanation('');
    }

    // If still no questions, automatically generate a default check-for-understanding question so the upload doesn't fail
    if (finalQuestions.length === 0) {
      const defaultQuestion: QuizQuestion = {
        id: `q-custom-${Date.now()}-default`,
        question: `Do you understand the key safety regulations and procedures outlined in "${title}"?`,
        options: [
          'Yes, I fully understand and will comply with these standards',
          'No, I need to re-watch the tutorial for better clarity',
          'I have some specific questions for my supervisor / safety officer',
          'I am unsure about some of the procedures'
        ],
        correctIndex: 0,
        explanation: 'Acknowledging compliance and understanding of safety procedures is a mandatory requirement under Singapore training standards.'
      };
      finalQuestions.push(defaultQuestion);
    }

    const newTutorial: VideoTutorial = {
      id: `tut-custom-${Date.now()}`,
      title,
      category,
      module: selectedModule,
      topic: selectedTopic,
      description,
      videoUrl,
      duration,
      xpValue: Number(xpValue) || 150,
      isCompleted: false,
      quizPassed: false,
      downloaded: false,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days deadline
      cloudSource
    };

    onPublishTutorial(newTutorial, finalQuestions);

    setSuccessMsg('Tutorial and Verification Quiz published to Wee Hur Training Hub successfully!');
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 5000);

    // Reset entire form
    setTitle('');
    setCategory(catalog[0]?.name || '');
    setSelectedModule(catalog[0]?.modules[0]?.title || '');
    setSelectedTopic(
      catalog[0]?.modules[0]?.topics[0]
        ? `Topic ${catalog[0].modules[0].topics[0].code}: ${catalog[0].modules[0].topics[0].title}`
        : ''
    );
    setDescription('');
    setVideoUrl('');
    setVideoFileName(null);
    setVideoFileSize(null);
    setDuration('05:00');
    setXpValue(150);
    setCloudSource('local');
    setQuestions([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            {t.uploadTutorial}
          </h3>
          <p className="text-xs text-slate-400">Publish custom training videos, categories, and associated safety audits</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ADMIN PRIVILEGES ACTIVE</span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="mb-6 bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-lg text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-pulse">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 bg-red-500/15 border border-red-500/30 p-4 rounded-lg text-red-300 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Super Admin Tab Switcher */}
      {currentRole === UserRole.SUPER_ADMIN && (
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveAdminSubTab('upload')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSubTab === 'upload'
                ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            Publish Video Tutorial
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveAdminSubTab('curriculum');
              const firstTrack = catalog[0];
              setSelectedCurriculumTrack(firstTrack?.name || '');
              if (firstTrack && firstTrack.modules.length > 0) {
                setTargetModuleForTopic(firstTrack.modules[0].title);
              }
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSubTab === 'curriculum'
                ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Curriculum Manager (Super Admin Only)
          </button>
        </div>
      )}

      {activeAdminSubTab === 'curriculum' && currentRole === UserRole.SUPER_ADMIN ? (
        <div className="space-y-6">
          <div className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Dynamic Course Curriculum Configuration
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Customize Wee Hur construction training tracks, modules, and topics instantly.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded">
                Live Engine
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Tracks selector & Curriculum list tree (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Training Track</span>
              <div className="grid grid-cols-1 gap-2">
                {catalog.map((track) => {
                  const isSelected = selectedCurriculumTrack === track.name;
                  return (
                    <button
                      key={track.name}
                      type="button"
                      onClick={() => handleCurriculumTrackChange(track.name)}
                      className={`text-left p-3 rounded-lg border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm'
                          : 'bg-slate-950/50 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{track.name}</span>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">
                        {track.modules.length} modules
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Curriculum List Tree */}
              <div className="bg-slate-950/30 border border-slate-850 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Track Curriculum Tree</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded">
                    Active: {selectedCurriculumTrack}
                  </span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {catalog.find((t) => t.name === selectedCurriculumTrack)?.modules.map((mod) => (
                    <div key={mod.title} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-1.5">
                        <span className="text-xs font-black text-slate-200 leading-tight">
                          {mod.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(selectedCurriculumTrack, mod.title)}
                          title="Delete this module"
                          className="text-red-400 hover:text-red-300 p-1 bg-red-950/10 hover:bg-red-950/30 border border-red-900/20 rounded cursor-pointer transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {mod.topics.map((topic) => (
                          <div key={topic.code} className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-850/50 text-[11px] gap-2 hover:border-slate-800">
                            <div className="flex items-start gap-1.5 min-w-0">
                              <span className="text-[10px] text-cyan-400 font-mono font-bold leading-none bg-cyan-500/10 px-1 py-0.5 rounded select-none shrink-0 mt-0.5">
                                {topic.code}
                              </span>
                              <span className="text-slate-300 truncate font-semibold leading-tight">
                                {topic.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(selectedCurriculumTrack, mod.title, topic.code)}
                              title="Delete this topic"
                              className="text-red-400/80 hover:text-red-300 p-1 cursor-pointer hover:bg-red-950/20 rounded transition-colors shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {mod.topics.length === 0 && (
                          <p className="text-[10px] text-slate-500 italic text-center py-1">No topics inside this module.</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!catalog.find((t) => t.name === selectedCurriculumTrack)?.modules.length) && (
                    <p className="text-xs text-slate-500 italic text-center py-6">No modules in this track. Create one!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Admin suite (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Form A: Add Module */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                    Add Module to {selectedCurriculumTrack}
                  </h5>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label htmlFor="new-module-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Module Title</label>
                    <input
                      id="new-module-input"
                      type="text"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="e.g., Prefabricated PPVC Alignment Checklists"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddModule(selectedCurriculumTrack, newModuleTitle)}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-cyan-300 text-xs font-black py-2.5 rounded-lg border border-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create Module
                  </button>
                </div>
              </div>

              {/* Form B: Add Topic */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                    Add Topic to Selected Module
                  </h5>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label htmlFor="target-module-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Target Module</label>
                    <select
                      id="target-module-select"
                      value={targetModuleForTopic}
                      onChange={(e) => setTargetModuleForTopic(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                    >
                      <option value="">-- Choose Module --</option>
                      {catalog.find((t) => t.name === selectedCurriculumTrack)?.modules.map((mod) => (
                        <option key={mod.title} value={mod.title}>
                          {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-1">
                      <label htmlFor="new-topic-code" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Topic Code</label>
                      <input
                        id="new-topic-code"
                        type="text"
                        value={newTopicCode}
                        onChange={(e) => setNewTopicCode(e.target.value)}
                        placeholder="e.g. 4.11"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-center font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="new-topic-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Topic Title</label>
                      <input
                        id="new-topic-title"
                        type="text"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="e.g., Pre-Lifting Anchor Inspections and Shackle Limits"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddTopic(selectedCurriculumTrack, targetModuleForTopic, newTopicCode, newTopicTitle)}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 text-xs font-black py-2.5 rounded-lg border border-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create and Link Topic
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-6">
        
        {/* Step 1: Video Tutorial details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="space-y-4">
            <div>
              <label htmlFor="upload-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.videoTitle} *</label>
              <input
                id="upload-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Prefabricated Volumetric Construction Lifting Procedures"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

             <div>
              <label htmlFor="upload-category" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Training Track *</label>
              <select
                id="upload-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
              >
                {catalog.map((track) => (
                  <option key={track.name} value={track.name}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="upload-module" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Training Module *</label>
              <select
                id="upload-module"
                value={selectedModule}
                onChange={(e) => handleModuleChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
              >
                {catalog.find(t => t.name === category)?.modules.map((mod) => (
                  <option key={mod.title} value={mod.title}>
                    {mod.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="upload-topic" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Training Topic *</label>
              <select
                id="upload-topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
              >
                {catalog.find(t => t.name === category)
                  ?.modules.find(m => m.title === selectedModule)
                  ?.topics.map((topic) => (
                    <option key={topic.code} value={`Topic ${topic.code}: ${topic.title}`}>
                      Topic {topic.code}: {topic.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="upload-duration" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration *</label>
                <input
                  id="upload-duration"
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 05:30"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="upload-xp" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">XP Reward *</label>
                <input
                  id="upload-xp"
                  type="number"
                  required
                  value={xpValue}
                  onChange={(e) => setXpValue(Number(e.target.value))}
                  placeholder="e.g., 150"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="upload-source" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cloud Storage Source</label>
              <select
                id="upload-source"
                value={cloudSource}
                onChange={(e) => setCloudSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="local">Direct / Local Server Storage</option>
                <option value="Google Drive">Google Drive Linked folder</option>
                <option value="OneDrive">Microsoft OneDrive Linked folder</option>
                <option value="AWS S3">AWS S3 Corporate Bucket</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.videoFile} *</span>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : videoFileName
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-slate-800 hover:border-slate-750 bg-slate-950/30'
                }`}
                onClick={() => {
                  if (!videoFileName) {
                    document.getElementById('video-file-picker')?.click();
                  }
                }}
              >
                <input
                  id="video-file-picker"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {videoFileName ? (
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <FileVideo className="w-8 h-8 animate-pulse" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-100 truncate max-w-[200px] sm:max-w-xs">{videoFileName}</p>
                        <p className="text-[10px] text-slate-400">{videoFileSize || 'Unknown Size'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearVideoFile();
                      }}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Remove Video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">Drag & drop video file here, or <span className="text-cyan-400 underline decoration-cyan-500/30">browse</span></p>
                    <p className="text-[10px] text-slate-500">Supports MP4, WEBM, MOV (Max 150MB)</p>
                  </div>
                )}
              </div>

              {/* URL fallback option */}
              <div className="mt-3.5 pt-3.5 border-t border-slate-850">
                <label htmlFor="upload-video-url" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Or paste direct streaming link instead</label>
                <input
                  id="upload-video-url"
                  type="text"
                  value={videoUrl.startsWith('blob:') ? '' : videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setVideoFileName(null);
                    setVideoFileSize(null);
                  }}
                  placeholder="e.g., https://assets.mixkit.co/videos/preview/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Real Google Drive Picker Trigger */}
              {driveUser && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                      Wee Hur Cloud Assets
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDrivePicker(!showDrivePicker);
                        if (!showDrivePicker) fetchDriveFiles();
                      }}
                      className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/35 px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      {showDrivePicker ? 'Hide Drive Assets' : 'Import from Google Drive'}
                    </button>
                  </div>

                  {showDrivePicker && (
                    <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 space-y-3 max-h-[220px] overflow-y-auto">
                      <div className="flex gap-2">
                        <input
                          id="admin-drive-search"
                          type="text"
                          value={driveSearchQuery}
                          onChange={(e) => setDriveSearchQuery(e.target.value)}
                          placeholder="Search files in Drive..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => fetchDriveFiles(driveSearchQuery)}
                          disabled={isSearchingDrive}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                        >
                          {isSearchingDrive ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Search className="w-3 h-3" />
                          )}
                          <span>Search</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        {isSearchingDrive ? (
                          <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-xs">
                            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                            <span>Listing items...</span>
                          </div>
                        ) : driveFiles.length > 0 ? (
                          driveFiles.map((file) => (
                            <button
                              key={file.id}
                              type="button"
                              onClick={() => handleSelectDriveFile(file)}
                              className="w-full text-left p-2 rounded bg-slate-900 border border-slate-800/60 hover:border-cyan-500/30 hover:bg-slate-850 text-xs flex items-center justify-between gap-3 group transition-all"
                            >
                              <div className="min-w-0 flex items-center gap-2">
                                <FileVideo className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="font-medium text-slate-300 truncate group-hover:text-cyan-300">{file.name}</span>
                              </div>
                              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shrink-0">
                                Use File
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="text-center py-6 text-slate-600 text-xs font-semibold">
                            No files found in Google Drive.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="upload-desc" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.videoDesc} *</label>
              <textarea
                id="upload-desc"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly detail what employees will learn: key regulatory checks, safe workloads, PPE setups, and verification goals."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none leading-relaxed"
              />
            </div>
          </div>

        </div>

        {/* Step 2: Quiz Creator Section */}
        <div className="border-t border-slate-800/80 pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
              {t.quizCreator}
            </h4>
          </div>

          <div className="bg-slate-950/50 rounded-lg border border-slate-800/80 p-4 space-y-4">
            {/* Enter Question */}
            <div>
              <label htmlFor="quiz-question-input" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Question Description</label>
              <input
                id="quiz-question-input"
                type="text"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="e.g., What is the minimum wind speed at which crane lifting is halted?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Enter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
                  <span className="font-bold text-xs text-cyan-400">{String.fromCharCode(65 + idx)}.</span>
                  <input
                    id={`quiz-option-input-${idx}`}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="w-full bg-transparent border-none text-xs text-slate-200 focus:outline-none p-0"
                  />
                  <input
                    id={`quiz-option-radio-${idx}`}
                    type="radio"
                    name="correct-option-radio"
                    checked={correctIdx === idx}
                    onChange={() => setCorrectIdx(idx)}
                    className="w-3.5 h-3.5 accent-cyan-500 shrink-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Answer feedback Explanation */}
            <div>
              <label htmlFor="quiz-explanation-input" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Answer Explanation (Shown when complete)</label>
              <input
                id="quiz-explanation-input"
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="e.g., Safe tower crane operation regulations halt operations when wind speed exceeds 10m/s (or 36km/h)."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Add question list button */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-cyan-300 text-xs font-bold px-4 py-2 rounded-lg border border-cyan-500/25 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addQuestion}</span>
            </button>
          </div>

          {/* Added Questions List view */}
          {questions.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Added Questions ({questions.length})</h5>
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {questions.map((q, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 rounded-lg p-3 flex items-center justify-between text-xs gap-3">
                    <div className="truncate">
                      <p className="font-bold text-slate-200 truncate">Q{idx + 1}: {q.question}</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5 truncate">
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-400 hover:text-red-300 p-1 bg-red-950/10 hover:bg-red-950/35 border border-red-900/20 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="border-t border-slate-800/80 pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-all shadow-cyan-500/10"
          >
            <ArrowUpCircle className="w-5 h-5" />
            <span>{t.publishTutorial}</span>
          </button>
        </div>

      </form>
      )}
    </div>
  );
};
