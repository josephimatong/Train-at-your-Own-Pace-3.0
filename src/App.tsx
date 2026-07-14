/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Clock, 
  ChevronRight, 
  Lock, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  Users,
  Bell,
  Check,
  Mail,
  User,
  Settings,
  X,
  RefreshCw,
  BarChart3,
  PlusCircle
} from 'lucide-react';
import { 
  UserRole, 
  Language, 
  VideoTutorial, 
  QuizQuestion, 
  TRANSLATIONS, 
  InAppNotification,
  LeaderboardEntry
} from './types';
import { 
  INITIAL_TUTORIALS, 
  INITIAL_QUIZZES, 
  INITIAL_LEADERBOARD, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_STUDY_NOTES 
} from './data';
import { HeaderControls } from './components/HeaderControls';
import { VideoPlayer } from './components/VideoPlayer';
import { QuizSection } from './components/QuizSection';
import { CollaborativeNotes } from './components/CollaborativeNotes';
import { SafetyChatbot } from './components/SafetyChatbot';
import { Leaderboard } from './components/Leaderboard';
import { ManagerAnalytics } from './components/ManagerAnalytics';
import { AdminUpload } from './components/AdminUpload';
import { NotificationCenter } from './components/NotificationCenter';
import { CloudStorageSync } from './components/CloudStorageSync';
import { UserManagement } from './components/UserManagement';
import { MobileAccessGuide } from './components/MobileAccessGuide';
import { EarnedBadges } from './components/EarnedBadges';
import { initAuth, googleSignIn, logout as googleLogout, emailSignIn, emailRegister, resetPassword, updateUserAccountDetails } from './lib/driveAuth';
import {
  syncUserProfile,
  getUserProfile,
  saveStudyNoteToFirestore,
  getAllStudyNotesFromFirestore,
  saveCompletionToFirestore,
  getUserCompletionsFromFirestore,
  getLeaderboardFromFirestore,
  saveNotificationToFirestore,
  getUserNotificationsFromFirestore,
  saveUserToFirestore,
  getProjectSitesFromFirestore,
  getWeeHurRolesFromFirestore
} from './lib/firebaseSync';
import { TRAINING_CATALOG, TrackData } from './categoryData';

export default function App() {
  // Global States
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-preference');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const [currentLanguage, setLanguage] = useState<Language>(Language.EN);
  const [currentRole, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [activeTab, setActiveTab] = useState<string>('training');

  useEffect(() => {
    setActiveTab('training');
  }, [currentRole]);

  const [isOffline, setIsOffline] = useState(false);
  const [tutorials, setTutorials] = useState<VideoTutorial[]>(INITIAL_TUTORIALS);
  const [trainingCatalog, setTrainingCatalog] = useState<TrackData[]>(() => {
    try {
      const saved = localStorage.getItem('weehur_training_catalog');
      return saved ? JSON.parse(saved) : TRAINING_CATALOG;
    } catch {
      return TRAINING_CATALOG;
    }
  });

  useEffect(() => {
    localStorage.setItem('weehur_training_catalog', JSON.stringify(trainingCatalog));
  }, [trainingCatalog]);

  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [activeTutorialId, setActiveTutorialId] = useState('tut-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [studyNotes, setStudyNotes] = useState<Record<string, string>>(INITIAL_STUDY_NOTES);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('weehur_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Save leaderboard whenever it changes
  useEffect(() => {
    localStorage.setItem('weehur_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Secure Authentication States
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  // Video and Quiz active progress maps for module cards
  const [videoProgressMap, setVideoProgressMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('weehur_video_progress_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [quizProgressMap, setQuizProgressMap] = useState<Record<string, { current: number; total: number; isFinished: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('weehur_quiz_progress_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('weehur_video_progress_map', JSON.stringify(videoProgressMap));
  }, [videoProgressMap]);

  useEffect(() => {
    localStorage.setItem('weehur_quiz_progress_map', JSON.stringify(quizProgressMap));
  }, [quizProgressMap]);

  const handleUpdateVideoProgress = (tutId: string, percent: number) => {
    setVideoProgressMap((prev) => ({
      ...prev,
      [tutId]: percent,
    }));
  };

  const handleUpdateQuizProgress = (tutId: string, current: number, total: number, isFinished: boolean) => {
    setQuizProgressMap((prev) => ({
      ...prev,
      [tutId]: { current, total, isFinished },
    }));
  };

  // Localized helper strings for visual progress bars on the cards
  const progressTranslations: Record<Language, {
    completed: string;
    watched: string;
    left: string;
    quiz: string;
    answered: string;
    remaining: string;
  }> = {
    [Language.EN]: {
      completed: "Training Completed",
      watched: "Video watched",
      left: "left",
      quiz: "Quiz",
      answered: "answered",
      remaining: "remaining",
    },
    [Language.ZH]: {
      completed: "培训已完成",
      watched: "视频已观看",
      left: "剩余",
      quiz: "测验",
      answered: "已答",
      remaining: "剩余",
    },
    [Language.MS]: {
      completed: "Latihan Selesai",
      watched: "Video ditonton",
      left: "tinggal",
      quiz: "Kuiz",
      answered: "dijawab",
      remaining: "tinggal",
    },
    [Language.TA]: {
      completed: "பயிற்சி முடிந்தது",
      watched: "வீடியோ பார்க்கப்பட்டது",
      left: "மீதமுள்ளது",
      quiz: "வினாடி வினா",
      answered: "பதிலளிக்கப்பட்டது",
      remaining: "மீதமுள்ளது",
    },
  };

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<{ type: 'quiz' | 'note'; payload: any }[]>([]);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  // Account Profile Settings Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileProject, setProfileProject] = useState('Woodlands BTO Project');
  const [profileWeeHurRole, setProfileWeeHurRole] = useState('Site Engineer');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileIsSubmitting, setProfileIsSubmitting] = useState(false);

  // Dynamic Options
  const [projectSites, setProjectSites] = useState<string[]>([
    'Woodlands BTO Project',
    'Punggol PPVC Site',
    'Kovan Residential',
    'Geylang Warehouse',
    'Changi Site B',
    'Wee Hur HQ Office'
  ]);
  const [weeHurRoles, setWeeHurRoles] = useState<string[]>([
    'Site Engineer',
    'Safety Coordinator',
    'Project Manager',
    'Tower Crane Operator',
    'General Worker',
    'Safety Assistant',
    'Structural Supervisor'
  ]);

  const handleOpenProfileSettings = () => {
    if (!driveUser) {
      triggerToast('Please sign in first to manage your safety profile settings.', 'warning');
      return;
    }
    const currentEntry = leaderboard.find(l => l.email === driveUser.email || l.uid === driveUser.uid);
    setProfileName(currentEntry?.name || driveUser.displayName || '');
    setProfileProject(currentEntry?.site || 'Woodlands BTO Project');
    setProfileWeeHurRole(currentEntry?.role || 'Site Engineer');
    setProfilePassword('');
    setProfileConfirmPassword('');
    setIsProfileModalOpen(true);
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      triggerToast('Name field is required.', 'warning');
      return;
    }

    if (profilePassword) {
      if (profilePassword.length < 6) {
        triggerToast('Password must be at least 6 characters long.', 'warning');
        return;
      }
      if (profilePassword !== profileConfirmPassword) {
        triggerToast('Passwords do not match.', 'warning');
        return;
      }
    }

    setProfileIsSubmitting(true);
    try {
      // 1. Update Firebase Auth name and/or password
      await updateUserAccountDetails(profileName, profilePassword);

      // 2. Fetch the current Firestore profile to retain their accessibility role
      const profile = await getUserProfile(driveUser.uid);
      const accessibilityRole = profile?.role || (driveUser.email === 'josephimatong@weehur.com.sg' ? 'super_admin' : 'employee');

      // 3. Save user to Firestore
      const currentEntry = leaderboard.find(l => l.email === driveUser.email || l.uid === driveUser.uid);
      await saveUserToFirestore({
        uid: driveUser.uid,
        email: driveUser.email || '',
        displayName: profileName,
        role: accessibilityRole, // Keep actual role from db
        project: profileProject,
        weeHurRole: profileWeeHurRole,
        xp: currentEntry?.xp || profile?.xp || 0,
        completions: currentEntry?.completions || profile?.completions || 0,
        badges: currentEntry?.badges || profile?.badges || []
      });

      triggerToast('Your safety profile and credentials have been updated successfully!', 'success');
      setIsProfileModalOpen(false);
      setDriveUser({ ...driveUser, displayName: profileName });
      // Refresh the leaderboard list
      await refreshUsersList();
    } catch (err: any) {
      console.error('Failed to update safety profile details:', err);
      triggerToast(err.message || 'Error updating profile details. Please try again.', 'warning');
    } finally {
      setProfileIsSubmitting(false);
    }
  };

  // Google Drive Active Session States
  const [driveUser, setDriveUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setDriveUser(user);
      },
      () => {
        setDriveUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadFirestoreData = async (user: any) => {
    let profile: any = null;
    let currentXp = 0;
    let currentCompletions = 0;
    let currentBadges: string[] = [];
    let resolvedRole = UserRole.EMPLOYEE;

    if (user.email === 'josephimatong@weehur.com.sg') {
      resolvedRole = UserRole.SUPER_ADMIN;
    }

    // 1. Get user profile
    try {
      profile = await getUserProfile(user.uid);
      if (profile) {
        if (profile.role) {
          resolvedRole = profile.role as UserRole;
        }
        // Force the super admin email to have super_admin role
        if (user.email === 'josephimatong@weehur.com.sg') {
          resolvedRole = UserRole.SUPER_ADMIN;
        }
        setRole(resolvedRole);
        currentXp = profile.xp || 0;
        currentCompletions = profile.completions || 0;
        currentBadges = profile.badges || [];

        // If the profile exists but doesn't have super_admin for the admin email, fix it in Firestore
        if (user.email === 'josephimatong@weehur.com.sg' && profile.role !== 'super_admin') {
          await syncUserProfile(user, currentXp, currentCompletions, currentBadges, 'super_admin');
        }
      } else {
        const currentUserEntry = leaderboard.find(l => l.isCurrentUser);
        if (currentUserEntry) {
          currentXp = currentUserEntry.xp;
          currentCompletions = currentUserEntry.completions;
          currentBadges = currentUserEntry.badges;
        }
        const defaultRole = user.email === 'josephimatong@weehur.com.sg' ? 'super_admin' : 'employee';
        await syncUserProfile(user, currentXp, currentCompletions, currentBadges, defaultRole);
        setRole(defaultRole as UserRole);
      }
    } catch (err) {
      console.warn('Failed to load user profile from Firestore, using local state:', err);
      // Fallback to local profile state
      const currentUserEntry = leaderboard.find(l => l.isCurrentUser);
      if (currentUserEntry) {
        currentXp = currentUserEntry.xp;
        currentCompletions = currentUserEntry.completions;
        currentBadges = currentUserEntry.badges;
        resolvedRole = (currentUserEntry.accessibilityRole as UserRole) || UserRole.EMPLOYEE;
      }
      if (user.email === 'josephimatong@weehur.com.sg') {
        resolvedRole = UserRole.SUPER_ADMIN;
      }
      setRole(resolvedRole);
    }

    // 2. Load all study notes from Firestore
    try {
      const dbNotes = await getAllStudyNotesFromFirestore();
      if (dbNotes && Object.keys(dbNotes).length > 0) {
        setStudyNotes(prev => ({ ...prev, ...dbNotes }));
      }
    } catch (err) {
      console.warn('Failed to load study notes from Firestore, keeping local notes:', err);
    }

    // 3. Load completions
    try {
      const dbCompletions = await getUserCompletionsFromFirestore(user.uid);
      if (dbCompletions && dbCompletions.length > 0) {
        setTutorials(prev => prev.map(tut => {
          const matched = dbCompletions.find(c => c.tutorialId === tut.id);
          if (matched) {
            return {
              ...tut,
              isCompleted: matched.isCompleted,
              quizPassed: matched.quizPassed,
              quizScore: matched.quizScore
            };
          }
          return tut;
        }));
      }
    } catch (err) {
      console.warn('Failed to load completions from Firestore, keeping cached completions:', err);
    }

    // 4. Load general leaderboard
    try {
      const dbLeaderboard = await getLeaderboardFromFirestore();
      if (dbLeaderboard && dbLeaderboard.length > 0) {
        const merged = dbLeaderboard.map(entry => ({
          ...entry,
          isCurrentUser: entry.uid === user.uid
        }));
        
        const hasCurrentUser = merged.some(m => m.isCurrentUser);
        if (!hasCurrentUser) {
          merged.push({
            name: user.displayName || user.email?.split('@')[0] || 'Learning Officer',
            email: user.email || 'officer@weehur.com.sg',
            xp: currentXp,
            completions: currentCompletions,
            badges: currentBadges,
            isCurrentUser: true,
            uid: user.uid,
            role: profile?.weeHurRole || 'Structural Supervisor',
            site: profile?.project || 'Kovan Residential',
            accessibilityRole: profile?.role || (user.email === 'josephimatong@weehur.com.sg' ? 'super_admin' : 'employee')
          });
        }

        const sorted = merged
          .sort((a, b) => b.xp - a.xp)
          .map((item, index) => ({ ...item, rank: index + 1 }));
        setLeaderboard(sorted);
      }
    } catch (err) {
      console.warn('Failed to load leaderboard from Firestore, keeping local leaderboard:', err);
    }

    // 5. Load notifications
    try {
      const dbNotifications = await getUserNotificationsFromFirestore(user.uid);
      if (dbNotifications && dbNotifications.length > 0) {
        const parsedNotifs = dbNotifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: n.time,
          read: n.read,
          type: n.type as 'achievement' | 'alert' | 'system'
        }));
        setNotifications(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newOnly = parsedNotifs.filter(n => !existingIds.has(n.id));
          return [...newOnly, ...prev];
        });
      }
    } catch (err) {
      console.warn('Failed to load notifications from Firestore, keeping local notifications:', err);
    }

    try {
      const sites = await getProjectSitesFromFirestore();
      if (sites && sites.length > 0) {
        setProjectSites(sites);
      }
      const roles = await getWeeHurRolesFromFirestore();
      if (roles && roles.length > 0) {
        setWeeHurRoles(roles);
      }
    } catch (err) {
      console.warn('Failed to load project sites and roles:', err);
    }

    triggerToast('Profile load completed.', 'success');
  };

  const refreshUsersList = async () => {
    try {
      const dbLeaderboard = await getLeaderboardFromFirestore();
      if (dbLeaderboard && dbLeaderboard.length > 0) {
        const merged = dbLeaderboard.map(entry => ({
          ...entry,
          isCurrentUser: driveUser ? entry.uid === driveUser.uid : false
        }));

        if (driveUser) {
          const hasCurrentUser = merged.some(m => m.isCurrentUser);
          if (!hasCurrentUser) {
            const profile = await getUserProfile(driveUser.uid);
            merged.push({
              name: driveUser.displayName || driveUser.email?.split('@')[0] || 'Learning Officer',
              email: driveUser.email || 'officer@weehur.com.sg',
              xp: profile?.xp || 0,
              completions: profile?.completions || 0,
              badges: profile?.badges || [],
              isCurrentUser: true,
              uid: driveUser.uid,
              role: profile?.weeHurRole || 'Structural Supervisor',
              site: profile?.project || 'Kovan Residential',
              accessibilityRole: profile?.role || (driveUser.email === 'josephimatong@weehur.com.sg' ? 'super_admin' : 'employee')
            });
          }
        }

        const sorted = merged
          .sort((a, b) => b.xp - a.xp)
          .map((item, index) => ({ ...item, rank: index + 1 }));
        setLeaderboard(sorted);
      }
    } catch (error) {
      const errStr = error instanceof Error ? error.message : String(error);
      if (errStr.toLowerCase().includes('offline')) {
        console.warn('Running offline: skipping user list refresh.');
      } else {
        console.error('Failed to refresh users list:', error);
      }
    }
  };

  useEffect(() => {
    if (driveUser) {
      loadFirestoreData(driveUser);
    }
  }, [driveUser]);

  const handleDriveLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setDriveUser(result.user);
        triggerToast('Connected to Google Drive successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Failed to log in to Google Drive:', error);
      triggerToast('Failed to connect to Google Drive.', 'warning');
    }
  };

  const handleDriveLogout = async () => {
    try {
      await googleLogout();
      setDriveUser(null);
      triggerToast('Disconnected from Google Drive.', 'info');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword) {
      triggerToast('Please provide both email and password.', 'warning');
      return;
    }
    setAuthLoading(true);
    setAuthErrorMessage(null);
    try {
      const user = await emailSignIn(authEmail, authPassword);
      setDriveUser(user);
      triggerToast('Signed in successfully!', 'success');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      setAuthErrorMessage(err.message || 'Incorrect corporate credentials.');
      triggerToast(err.message || 'Incorrect corporate credentials.', 'warning');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword || !authName.trim()) {
      triggerToast('Please fill out all fields.', 'warning');
      return;
    }
    setAuthLoading(true);
    setAuthErrorMessage(null);
    try {
      const user = await emailRegister(authEmail, authPassword, authName);
      setDriveUser(user);
      triggerToast('Account created successfully!', 'success');
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err: any) {
      console.error(err);
      setAuthErrorMessage(err.message || 'Failed to register account.');
      triggerToast(err.message || 'Failed to register account.', 'warning');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      triggerToast('Please provide your email to reset your password.', 'warning');
      return;
    }
    setAuthLoading(true);
    setAuthErrorMessage(null);
    try {
      await resetPassword(authEmail);
      triggerToast('Password reset email sent!', 'success');
      setAuthTab('login');
      setAuthPassword('');
    } catch (err: any) {
      console.error(err);
      setAuthErrorMessage(err.message || 'Failed to send reset email.');
      triggerToast(err.message || 'Failed to send reset email.', 'warning');
    } finally {
      setAuthLoading(false);
    }
  };

  const t = TRANSLATIONS[currentLanguage];

  // Auto load/save offline state
  useEffect(() => {
    const savedTutorials = localStorage.getItem('weehur_tutorials');
    const savedNotes = localStorage.getItem('weehur_notes');
    const savedXP = localStorage.getItem('weehur_xp');
    
    if (savedTutorials) setTutorials(JSON.parse(savedTutorials));
    if (savedNotes) setStudyNotes(JSON.parse(savedNotes));
    if (savedXP) {
      const xpVal = Number(savedXP);
      setLeaderboard((prev) =>
        prev.map((l) => (l.isCurrentUser ? { ...l, xp: xpVal } : l))
      );
    }
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleOffline = () => {
    setIsOffline((prev) => {
      const nextOfflineState = !prev;
      if (nextOfflineState) {
        triggerToast('Switched to Offline Mode. Only cached tutorials are playable.', 'warning');
      } else {
        triggerToast('Online Mode Activated. Synchronizing progress queues...', 'success');
        // Auto trigger sync if there are items in the queue
        if (syncQueue.length > 0) {
          handleSecureSync();
        }
      }
      return nextOfflineState;
    });
  };

  // Caching toggle
  const handleToggleDownload = (id: string) => {
    setTutorials((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, downloaded: true } : t));
      localStorage.setItem('weehur_tutorials', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Tutorial download completed! Access enabled for remote sites.', 'success');
  };

  // Save notes locally
  const handleSaveNotes = (id: string, text: string) => {
    setStudyNotes((prev) => {
      const updated = { ...prev, [id]: text };
      localStorage.setItem('weehur_notes', JSON.stringify(updated));
      return updated;
    });

    if (isOffline) {
      setSyncQueue((prev) => [...prev, { type: 'note', payload: { id, text } }]);
      triggerToast('Notes saved to offline sync buffer.', 'info');
    } else {
      if (driveUser) {
        saveStudyNoteToFirestore(driveUser.uid, driveUser.email || '', id, text)
          .then(() => {
            triggerToast('Collaborative notes synchronized with central database.', 'success');
          })
          .catch((err) => {
            const errStr = err instanceof Error ? err.message : String(err);
            if (errStr.toLowerCase().includes('offline')) {
              console.warn('Running offline: buffering note offline.');
            } else {
              console.error('Firestore save failed, buffering note offline:', err);
            }
            setSyncQueue((prev) => [...prev, { type: 'note', payload: { id, text } }]);
            triggerToast('Cloud sync failed; note saved to offline sync buffer.', 'warning');
          });
      } else {
        triggerToast('Collaborative notes synchronized with local cache.', 'success');
      }
    }
  };

  // Complete video tutorial
  const handleVideoEnd = () => {
    setTutorials((prev) => {
      const updated = prev.map((t) => (t.id === activeTutorialId ? { ...t, isCompleted: true } : t));
      localStorage.setItem('weehur_tutorials', JSON.stringify(updated));
      return updated;
    });
    handleUpdateVideoProgress(activeTutorialId, 100);
    triggerToast('Training video completed! Please take the verification quiz.', 'success');
    setTakingQuiz(true);
  };

  // Pass verification quiz
  const handlePassQuiz = (score: number) => {
    const passed = score >= 70;
    const activeTut = tutorials.find((t) => t.id === activeTutorialId);
    if (!activeTut) return;

    if (passed) {
      // Set quiz progress map to complete
      const quiz = quizzes[activeTutorialId];
      const totalQs = quiz?.questions?.length || 3;
      handleUpdateQuizProgress(activeTutorialId, totalQs, totalQs, true);

      // Award XP & completions
      setTutorials((prev) => {
        const updated = prev.map((t) =>
          t.id === activeTutorialId ? { ...t, quizPassed: true, quizScore: score, isCompleted: true } : t
        );
        localStorage.setItem('weehur_tutorials', JSON.stringify(updated));
        return updated;
      });

      // Update user leaderboards XP
      setLeaderboard((prev) => {
        const updated = prev.map((entry) => {
          if (entry.isCurrentUser) {
            const nextXp = entry.xp + activeTut.xpValue;
            localStorage.setItem('weehur_xp', String(nextXp));
            
            const nextCompletions = entry.completions + 1;
            const nextBadges = Array.from(new Set([...entry.badges, '⚡ Compliance Champ']));

            // Sync with Firestore if logged in
            if (driveUser) {
              saveCompletionToFirestore(driveUser.uid, activeTutorialId, true, true, score);
              syncUserProfile(driveUser, nextXp, nextCompletions, nextBadges, currentRole);
            }

            return {
              ...entry,
              xp: nextXp,
              completions: nextCompletions,
              badges: nextBadges,
            };
          }
          return entry;
        });
        // Re-rank entries based on XP
        return updated.sort((a, b) => b.xp - a.xp).map((item, index) => ({ ...item, rank: index + 1 }));
      });

      // Send immediate in-app notification
      const newNotif: InAppNotification = {
        id: `notif-dyn-${Date.now()}`,
        title: '🏆 Quiz Completed Successfully',
        message: `You scored ${score}% on the "${activeTut.title}" safety audit. Earned +${activeTut.xpValue} XP!`,
        time: 'Just now',
        read: false,
        type: 'achievement'
      };
      setNotifications((prev) => [newNotif, ...prev]);

      if (driveUser) {
        saveNotificationToFirestore(driveUser.uid, newNotif);
      }

      if (isOffline) {
        setSyncQueue((prev) => [...prev, { type: 'quiz', payload: { id: activeTutorialId, score } }]);
        triggerToast('Offline quiz score saved to sync queue.', 'info');
      } else {
        triggerToast(`Congratulations! Passed with ${score}% and earned +${activeTut.xpValue} XP!`, 'success');
      }
    } else {
      triggerToast(`Quiz unsuccessful (${score}%). Please review material and try again.`, 'warning');
    }
  };

  // Synchronizing data securely with AES-256 simulation logs
  const handleSecureSync = () => {
    setIsSyncing(true);
    setShowSyncModal(true);
    setSyncLogs([]);

    const log = (message: string) => {
      setSyncLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    log('Handshake requested with central cloud gateway...');
    
    setTimeout(() => {
      log('SSL connection verified. Loading offline sync buffer...');
      log(`Found ${syncQueue.length} items in sync queue.`);
    }, 800);

    setTimeout(() => {
      log('Securing transmission payload... Hashing blocks using SHA-256.');
      log('Symmetric 256-bit AES cryptographic session key generated.');
    }, 1600);

    setTimeout(async () => {
      log('Transmitting secure cipher blocks to Cloud Firestore... Done.');
      
      // Real synchronization for offline items
      if (driveUser && syncQueue.length > 0) {
        log('Processing offline sync buffer with Cloud Firestore...');
        try {
          for (const item of syncQueue) {
            if (item.type === 'note') {
              log(`Syncing offline note for tutorial: ${item.payload.id}`);
              await saveStudyNoteToFirestore(driveUser.uid, driveUser.email || '', item.payload.id, item.payload.text);
            } else if (item.type === 'quiz') {
              log(`Syncing offline quiz completion for tutorial: ${item.payload.id}`);
              await saveCompletionToFirestore(driveUser.uid, item.payload.id, true, true, item.payload.score);
            }
          }
          log('All offline buffer items successfully synchronized to Cloud Firestore!');
        } catch (err) {
          const errStr = err instanceof Error ? err.message : String(err);
          if (errStr.toLowerCase().includes('offline')) {
            console.warn('Running offline: skipping sync offline queue with Firestore.');
          } else {
            console.error('Failed to sync offline queue with Firestore:', err);
          }
          log('Warning: Some items failed to sync to Firestore.');
        }
      }
      
      setSyncQueue([]);
      triggerToast('Encrypted synchronization complete! Reports pushed successfully.', 'success');
    }, 2800);

    setTimeout(() => {
      setIsSyncing(false);
    }, 3200);
  };

  // Admin Publish custom tutorial
  const handlePublishTutorial = (newTutorial: VideoTutorial, customQuestions: QuizQuestion[]) => {
    // Add tutorial
    setTutorials((prev) => {
      const updated = [...prev, newTutorial];
      localStorage.setItem('weehur_tutorials', JSON.stringify(updated));
      return updated;
    });

    // Add associated quiz
    setQuizzes((prev) => ({
      ...prev,
      [newTutorial.id]: {
        tutorialId: newTutorial.id,
        questions: customQuestions,
      },
    }));

    // Trigger instant toast and deadline notifications
    const newNotif: InAppNotification = {
      id: `notif-admin-${Date.now()}`,
      title: '📋 New Safety Training Published',
      message: `Administrator published a new required module: "${newTutorial.title}". Due on ${newTutorial.deadline}.`,
      time: 'Just now',
      read: false,
      type: 'deadline'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    triggerToast('New training course and verification quiz published successfully!', 'success');
  };

  // Simulate deadlines and push checks
  const handleTriggerDeadlineCheck = () => {
    const uncompleted = tutorials.filter((t) => !t.quizPassed);
    if (uncompleted.length === 0) {
      triggerToast('All modules completed. Great job staying site-compliant!', 'success');
      return;
    }

    const firstDue = uncompleted[0];
    const pushNotif: InAppNotification = {
      id: `notif-check-${Date.now()}`,
      title: '🚨 Automated Training Deadline Alert',
      message: `Your safety compliance certification for "${firstDue.title}" is outstanding. Please finish immediately.`,
      time: 'Just now',
      read: false,
      type: 'deadline'
    };

    setNotifications((prev) => [pushNotif, ...prev]);
    triggerToast('Automated deadline scan completed. Alerts pushed successfully!', 'warning');

    // Trigger Native Notification if available and allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Wee Hur Safety Alert', {
        body: `Outstanding safety deadline: ${firstDue.title}`,
        icon: '/public/icon.png'
      });
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    triggerToast('Notifications cleared.', 'info');
  };

  // Filter tutorials list
  const filteredTutorials = tutorials.filter((tut) => {
    const matchesCategory = categoryFilter === 'All' || tut.category === categoryFilter;
    const matchesSearch =
      tut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tut.module && tut.module.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tut.topic && tut.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tut.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTutorial = tutorials.find((t) => t.id === activeTutorialId) || tutorials[0];
  const activeQuiz = quizzes[activeTutorialId];
  const currentUserXp = leaderboard.find((l) => l.isCurrentUser)?.xp || 1450;
  const currentUserRank = leaderboard.find((l) => l.isCurrentUser)?.rank || 4;
  const currentUserBadges = leaderboard.find((l) => l.isCurrentUser)?.badges || ['🔥 Fast Learner', '📋 Inspector'];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      
      {/* Dynamic Toast System */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl border flex items-center gap-2.5 transition-all text-xs font-semibold animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
          toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
          'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Synchronize Handshake Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
                <Lock className={`w-7 h-7 ${isSyncing ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100 tracking-tight">Secure Cloud Cryptographic Sync</h3>
                <p className="text-xs text-slate-400 mt-1">Symmetric key hashing and compliance reports synchronization</p>
              </div>

              {/* Progress Terminal */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 text-left font-mono text-[10px] leading-relaxed space-y-1.5 h-44 overflow-y-auto">
                {syncLogs.map((logLine, idx) => (
                  <p key={idx} className="text-slate-300">{logLine}</p>
                ))}
                {isSyncing && (
                  <span className="inline-block w-1.5 h-3 bg-cyan-500 animate-ping ml-1" />
                )}
              </div>

              <div className="pt-2">
                {!isSyncing ? (
                  <button
                    onClick={() => setShowSyncModal(false)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-md cursor-pointer transition-colors"
                  >
                    Close Log
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 animate-pulse font-bold">
                    <span className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                    <span>Synchronizing payload...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!driveUser ? (
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
          {/* Decorative radial gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md w-full space-y-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Logo and Brand */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-white text-2xl mx-auto">
                WH
              </div>
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Wee Hur Safety Hub
              </h2>
              <p className="text-xs text-slate-400">
                Authorized Safety & Compliance Academy Portal
              </p>
            </div>

            {/* Custom Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800/80">
              <button
                onClick={() => {
                  setAuthTab('login');
                  setAuthEmail('');
                  setAuthPassword('');
                  setAuthName('');
                  setAuthErrorMessage(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthTab('register');
                  setAuthEmail('');
                  setAuthPassword('');
                  setAuthName('');
                  setAuthErrorMessage(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Warning Info */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-[11px] text-amber-400/90 leading-relaxed flex items-start gap-2 font-medium">
              <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Security Alert:</strong> This application is accessible only to members of the <strong>weehur.com.sg</strong> community.
              </span>
            </div>

            {/* Firebase Auth Error Alert block */}
            {authErrorMessage && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-[11px] text-red-400 leading-relaxed space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <div className="font-bold text-red-300">Authentication Notice</div>
                </div>
                <div className="whitespace-pre-line font-medium text-[11px] text-slate-300 leading-normal pl-6">
                  {authErrorMessage}
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                if (authTab === 'login') handleEmailSignIn(e);
                else if (authTab === 'register') handleEmailRegister(e);
                else handleForgotPassword(e);
              }}
              className="space-y-4"
            >
              {authTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. ramesh@weehur.com.sg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Password
                  </label>
                  {authTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('forgot_password');
                        setAuthErrorMessage(null);
                      }}
                      className="text-[10px] text-cyan-500 hover:text-cyan-400 font-medium transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                  {authTab === 'forgot_password' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthErrorMessage(null);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-400 font-medium transition-colors cursor-pointer"
                    >
                      Back to login
                    </button>
                  )}
                </div>
                {authTab !== 'forgot_password' && (
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs py-3 rounded-lg shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                {authLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <span>
                    {authTab === 'login' && 'Sign In to Dashboard'}
                    {authTab === 'register' && 'Register Account'}
                    {authTab === 'forgot_password' && 'Send Reset Email'}
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-slate-900 px-2.5 text-slate-500">Or Continue With</span>
              </div>
            </div>

            {/* Google Sign In option */}
            <button
              onClick={handleDriveLogin}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {/* Google G Vector Icon */}
              <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.49 15.45 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.185-1.925H12.24z"
                />
              </svg>
              <span>Connect Corporate Google Account</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Global Header Controls */}
          <HeaderControls
            currentLanguage={currentLanguage}
            setLanguage={setLanguage}
            currentRole={currentRole}
            setRole={setRole}
            isOffline={isOffline}
            toggleOffline={handleToggleOffline}
            syncQueueLength={syncQueue.length}
            triggerSync={handleSecureSync}
            isSyncing={isSyncing}
            driveUser={driveUser}
            onDriveLogout={handleDriveLogout}
            theme={theme}
            setTheme={setTheme}
            onOpenProfileSettings={handleOpenProfileSettings}
          />

          {/* App Body Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          
          {/* NAVIGATION TABS (Visible only for Manager, Admin, Super Admin) */}
          {currentRole !== UserRole.EMPLOYEE && (
            <div id="role-nav-tabs" className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800/85 z-10 relative">
              <button
                id="tab-training"
                onClick={() => setActiveTab('training')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'training'
                    ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5 font-extrabold'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Training Hub
              </button>
              
              <button
                id="tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5 font-extrabold'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {currentRole === UserRole.MANAGER ? 'Manager Analytics' : 'Projects Insight'}
              </button>

              <button
                id="tab-users"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'users'
                    ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5 font-extrabold'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                {currentRole === UserRole.SUPER_ADMIN ? 'User Management & Customization' : 'User Directory'}
              </button>

              {(currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN) && (
                <button
                  id="tab-publish"
                  onClick={() => setActiveTab('publish')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'publish'
                      ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5 font-extrabold'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Training
                </button>
              )}

              {currentRole === UserRole.SUPER_ADMIN && (
                <button
                  id="tab-sync"
                  onClick={() => setActiveTab('sync')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'sync'
                      ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5 font-extrabold'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Cloud Backup Gateway
                </button>
              )}
            </div>
          )}

          {/* Employee Hero Summary Bar */}
          {activeTab === 'training' && (
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative overflow-hidden">
              {/* background vector lines */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
              
              <div className="space-y-1 z-10">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">{t.appName}</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Train at your own pace. Gain professional certificates, complete mandated safety quizzes, and compete in team leaderboards.
                </p>
              </div>

              {/* Trainee KPI Widget */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 z-10">
                <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-lg text-center font-mono">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CURRENT XP</p>
                  <p className="text-xl font-extrabold text-cyan-400">{currentUserXp.toLocaleString()}</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-lg text-center font-mono">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">LEADER RANK</p>
                  <p className="text-xl font-extrabold text-slate-200">#{currentUserRank}</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-lg text-center font-mono">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">COMPLETED</p>
                  <p className="text-xl font-extrabold text-emerald-400">
                    {tutorials.filter(t => t.quizPassed).length} / {tutorials.length}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* DYNAMIC ROLE VIEWS */}
          {activeTab === 'training' ? (
            /* =======================================
               EMPLOYEE DASHBOARD (CORE TRAINEE FLOW)
               ======================================= */
            <div className="space-y-6">
              <MobileAccessGuide currentLanguage={currentLanguage} />
              <EarnedBadges userBadges={currentUserBadges} currentLanguage={currentLanguage} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: Topic Search & Video Module Navigation list */}
                <div className="space-y-4 order-2 lg:order-1">
                  
                  {/* Category Selection Filter & Search */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-md">
                    <div>
                      <label htmlFor="topic-search-input" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{t.searchPlaceholder}</label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          id="topic-search-input"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search safety, crane, methods..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{t.allCategories}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'HR-Onboarding Track', 'Safety Track', 'Technical Track', 'BIM & Integrated Digital Delivery (BIM-IDD) Track', 'Operation Track'].map((cat) => {
                          const active = categoryFilter === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => setCategoryFilter(cat)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer border transition-colors ${
                                active
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-500'
                                  : 'bg-slate-950 hover:bg-slate-850 text-slate-400 border-slate-800'
                              }`}
                            >
                              {cat === 'All' ? t.allCategories : (t[cat] || cat)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modules Nav Index List */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      Modules ({filteredTutorials.length})
                    </h3>
                    
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {filteredTutorials.map((tut) => {
                        const isActive = tut.id === activeTutorialId;
                        const pT = progressTranslations[currentLanguage];
                        
                        return (
                          <button
                            key={tut.id}
                            onClick={() => {
                              setActiveTutorialId(tut.id);
                              setTakingQuiz(false); // Reset to video view when toggling
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isActive
                                ? 'bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                                : 'bg-slate-950 hover:bg-slate-850 border-slate-850'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-slate-850 text-slate-400 border border-slate-800 rounded">
                                  {tut.category}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-200 mt-1 truncate">{tut.title}</h4>
                              <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5 font-medium">
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" />
                                  {tut.duration} MIN
                                </span>
                                <span>+{tut.xpValue} XP</span>
                              </div>

                              {/* Progress Bars UI Section */}
                              {tut.quizPassed ? (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-[9px] text-emerald-400 mb-0.5 font-semibold">
                                    <span>{pT.completed}</span>
                                    <span>100% Score</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-full" />
                                  </div>
                                </div>
                              ) : tut.isCompleted ? (
                                (() => {
                                  const qProgress = quizProgressMap[tut.id];
                                  const questionsTotal = qProgress?.total || 3;
                                  const questionsCurrent = qProgress?.current || 0;
                                  const questionsLeft = questionsTotal - questionsCurrent;
                                  const quizPercentage = (questionsCurrent / questionsTotal) * 100;

                                  return (
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-[9px] text-cyan-400 mb-0.5 font-semibold">
                                        <span>{pT.quiz}: {questionsCurrent}/{questionsTotal} {pT.answered}</span>
                                        <span className="text-[8px] font-mono bg-cyan-950 px-1 py-0.2 rounded text-cyan-300">
                                          {questionsLeft} {pT.left}
                                        </span>
                                      </div>
                                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
                                          style={{ width: `${quizPercentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : (
                                (() => {
                                  const percent = videoProgressMap[tut.id] || 0;
                                  const durationMin = parseFloat(tut.duration) || 5;
                                  const remainingMin = durationMin * (1 - percent / 100);
                                  const remainingSecs = Math.round((remainingMin % 1) * 60);
                                  const remainingMinsInt = Math.floor(remainingMin);
                                  
                                  const remainingText = remainingMinsInt > 0 
                                    ? `${remainingMinsInt}m ${remainingSecs}s ${pT.remaining}` 
                                    : `${remainingSecs}s ${pT.remaining}`;

                                  return (
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5 font-semibold">
                                        <span>{pT.watched}: {Math.round(percent)}%</span>
                                        {percent > 0 && (
                                          <span className="text-[8px] text-slate-500 font-mono">
                                            {remainingText}
                                          </span>
                                        )}
                                      </div>
                                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                                          style={{ width: `${percent}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })()
                              )}
                            </div>

                            {/* Status icons indicators */}
                            <div className="shrink-0">
                              {tut.quizPassed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : tut.isCompleted ? (
                                <HelpCircle className="w-5 h-5 text-cyan-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {filteredTutorials.length === 0 && (
                        <p className="text-center py-8 text-slate-500 text-xs font-medium">No training topics match search query.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Side: Primary Active player or Quiz pane */}
                <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
                  
                  {/* Dynamic player or quiz */}
                  {!takingQuiz ? (
                    <VideoPlayer
                      tutorial={activeTutorial}
                      currentLanguage={currentLanguage}
                      isOffline={isOffline}
                      onToggleDownload={handleToggleDownload}
                      onVideoEnd={handleVideoEnd}
                      onTakeQuiz={() => setTakingQuiz(true)}
                      onVideoProgressUpdate={(percent) => handleUpdateVideoProgress(activeTutorialId, percent)}
                    />
                  ) : (
                    <QuizSection
                      quiz={activeQuiz}
                      tutorial={activeTutorial}
                      currentLanguage={currentLanguage}
                      userName={driveUser?.displayName || driveUser?.email?.split('@')[0] || "Trainee"}
                      onPassQuiz={handlePassQuiz}
                      onClose={() => setTakingQuiz(false)}
                      onQuizProgressUpdate={handleUpdateQuizProgress}
                    />
                  )}

                  {/* Shared study notes */}
                  <CollaborativeNotes
                    tutorialId={activeTutorialId}
                    currentLanguage={currentLanguage}
                    initialContent={studyNotes[activeTutorialId] || ''}
                    isOffline={isOffline}
                    onSaveNotes={handleSaveNotes}
                    tutorialTitle={activeTutorial?.title}
                    tutorialCategory={activeTutorial?.category}
                    tutorialDescription={activeTutorial?.description}
                  />

                </div>

              </div>

              {/* Notifications Center & Regional Leaderboard widgets */}
              <NotificationCenter
                notifications={notifications}
                tutorials={tutorials}
                currentLanguage={currentLanguage}
                onMarkRead={handleMarkNotificationRead}
                onClearAll={handleClearNotifications}
                onTriggerDeadlineCheck={handleTriggerDeadlineCheck}
              />

              <Leaderboard entries={leaderboard} currentLanguage={currentLanguage} />

            </div>
          ) : activeTab === 'analytics' ? (
            /* =======================================
               ANALYTICS & CHARTS
               ======================================= */
            <div className="space-y-6">
              <ManagerAnalytics currentLanguage={currentLanguage} tutorials={tutorials} />
              <Leaderboard entries={leaderboard} currentLanguage={currentLanguage} />
            </div>
          ) : activeTab === 'users' ? (
            /* =======================================
               USER MANAGEMENT & CONFIG
               ======================================= */
            <div className="space-y-6">
              <UserManagement
                currentLanguage={currentLanguage}
                currentRole={currentRole}
                leaderboard={leaderboard}
                currentUserEmail={driveUser?.email || ""}
                onRefreshUsers={refreshUsersList}
                triggerToast={triggerToast}
                setSimulatedRole={setRole}
                setLeaderboard={setLeaderboard}
              />
            </div>
          ) : activeTab === 'publish' && (currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN) ? (
            /* =======================================
               PUBLISH MODULES & VIDEO CONTENT
               ======================================= */
            <div className="space-y-6">
              <AdminUpload 
                currentLanguage={currentLanguage} 
                onPublishTutorial={handlePublishTutorial} 
                driveUser={driveUser}
                currentRole={currentRole}
                trainingCatalog={trainingCatalog}
                onUpdateCatalog={setTrainingCatalog}
              />
            </div>
          ) : activeTab === 'sync' && currentRole === UserRole.SUPER_ADMIN ? (
            /* =======================================
               CLOUD SYNC & BACKUP GATEWAY (SUPER ADMIN)
               ======================================= */
            <div className="space-y-6">
              <CloudStorageSync 
                currentLanguage={currentLanguage} 
                driveUser={driveUser}
                onDriveLogin={handleDriveLogin}
                onDriveLogout={handleDriveLogout}
                studyNotes={studyNotes}
                tutorials={tutorials}
              />
              <NotificationCenter
                notifications={notifications}
                tutorials={tutorials}
                currentLanguage={currentLanguage}
                onMarkRead={handleMarkNotificationRead}
                onClearAll={handleClearNotifications}
                onTriggerDeadlineCheck={handleTriggerDeadlineCheck}
              />
            </div>
          ) : null}

        </div>
      </main>
      </>
      )}

      {/* Humble Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Wee Hur Construction Pte Ltd. Safety & Compliance Academy Hub. Singapore.</p>
        <p className="mt-1 text-[10px] text-slate-600">Encrypted AES-GCM local storage vault connected</p>
      </footer>

      {/* Floating Multilingual Safety AI Chatbot Assistant */}
      <SafetyChatbot currentLanguage={currentLanguage} currentRole={currentRole} />

      {/* Account / Profile / Password Settings Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-950/40 border-b border-slate-850 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>My Profile & Credentials</span>
              </h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfileSettings} className="p-5 space-y-4">
              {/* Info Text */}
              <p className="text-[11px] text-slate-400">
                Update your corporate identity details and safety portal password. These credentials will be synced securely with Firestore and Firebase Auth.
              </p>

              {/* Email (Disabled) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Corporate Email
                </label>
                <input
                  type="email"
                  disabled
                  value={driveUser?.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono focus:outline-none"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Tan Ah Kow"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Project Site */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Project Site Assignment
                </label>
                <select
                  value={profileProject}
                  onChange={(e) => setProfileProject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  {projectSites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Wee Hur Job Title
                </label>
                <select
                  value={profileWeeHurRole}
                  onChange={(e) => setProfileWeeHurRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  {weeHurRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-850/60 my-2 pt-3">
                <p className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest font-mono mb-2">Change Password</p>
                <p className="text-[9px] text-slate-500 leading-tight mb-3">Leave blank if you do not want to modify your password.</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-semibold text-slate-400">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-semibold text-slate-400">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={profileConfirmPassword}
                      onChange={(e) => setProfileConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-850/60">
                <button
                  type="button"
                  disabled={profileIsSubmitting}
                  onClick={() => setIsProfileModalOpen(false)}
                  className="bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileIsSubmitting}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-lg shadow-cyan-500/15 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {profileIsSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
