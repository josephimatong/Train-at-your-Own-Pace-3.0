/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  doc, 
  setDoc, 
  getDoc, onSnapshot, 
  getDocs, 
  collection, 
  query, 
  where, 
  serverTimestamp, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase.ts';
import { User } from 'firebase/auth';

/**
 * Sync the logged-in user's profile and learning state to Firestore.
 */
export async function syncUserProfile(
  user: User, 
  xp: number, 
  completions: number, 
  badges: string[],
  role: string = 'employee'
) {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Force josephimatong@weehur.com.sg to always be super_admin
    const resolvedRole = user.email === 'josephimatong@weehur.com.sg' 
      ? 'super_admin' 
      : (userSnap.exists() ? (userSnap.data().role || role) : role);

    const dataPayload = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: resolvedRole,
      xp: xp,
      completions: completions,
      badges: badges,
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, dataPayload, { merge: true });
    console.log('User profile synced successfully with Firestore.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch a specific user's profile from Firestore.
 */
export async function getUserProfile(userId: string) {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save or update study notes on Firestore.
 */
export async function saveStudyNoteToFirestore(
  userId: string, 
  userEmail: string, 
  tutorialId: string, 
  content: string
) {
  const noteId = `${tutorialId}_${userId}`;
  const path = `notes/${noteId}`;
  try {
    const noteRef = doc(db, 'notes', noteId);
    await setDoc(noteRef, {
      id: noteId,
      tutorialId,
      userId,
      userEmail,
      content,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('Study note saved to Firestore:', noteId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all study notes from Firestore.
 */
export async function getAllStudyNotesFromFirestore() {
  const path = 'notes';
  try {
    const notesColl = collection(db, 'notes');
    const qSnap = await getDocs(notesColl);
    const notes: Record<string, string> = {};
    qSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.tutorialId && data.content) {
        notes[data.tutorialId] = data.content;
      }
    });
    return notes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save or update a tutorial/quiz completion record to Firestore.
 */
export async function saveCompletionToFirestore(
  userId: string,
  tutorialId: string,
  isCompleted: boolean,
  quizPassed: boolean,
  quizScore: number
) {
  const completionId = `${userId}_${tutorialId}`;
  const path = `completions/${completionId}`;
  try {
    const completionRef = doc(db, 'completions', completionId);
    await setDoc(completionRef, {
      id: completionId,
      userId,
      tutorialId,
      isCompleted,
      quizPassed,
      quizScore,
      completedAt: serverTimestamp()
    }, { merge: true });
    console.log('Completion recorded on Firestore:', completionId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all tutorial completions for a specific user.
 */
export async function getUserCompletionsFromFirestore(userId: string) {
  const path = 'completions';
  try {
    const completionsColl = collection(db, 'completions');
    const q = query(completionsColl, where('userId', '==', userId));
    const qSnap = await getDocs(q);
    const completions: any[] = [];
    qSnap.forEach((docSnap) => {
      completions.push(docSnap.data());
    });
    return completions;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save or update leaderboard score profiles from Firestore.
 */
export async function getLeaderboardFromFirestore() {
  const path = 'users';
  try {
    const usersColl = collection(db, 'users');
    const qSnap = await getDocs(usersColl);
    const entries: any[] = [];
    qSnap.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        name: data.displayName || data.email?.split('@')[0] || 'Learning Officer',
        email: data.email || 'officer@weehur.com.sg',
        xp: data.xp || 0,
        completions: data.completions || 0,
        badges: data.badges || [],
        uid: data.uid,
        role: data.weeHurRole || 'Structural Supervisor',
        site: data.project || 'Kovan Residential',
        accessibilityRole: data.role || 'employee'
      });
    });
    return entries;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save a notification record to Firestore.
 */
export async function saveNotificationToFirestore(
  userId: string,
  notification: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'deadline' | 'achievement' | 'sync' | 'alert';
  }
) {
  const path = `notifications/${notification.id}`;
  try {
    const notifRef = doc(db, 'notifications', notification.id);
    await setDoc(notifRef, {
      id: notification.id,
      userId,
      title: notification.title,
      message: notification.message,
      time: notification.time,
      read: notification.read,
      type: notification.type,
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log('Notification saved to Firestore:', notification.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch notifications for a specific user.
 */
export async function getUserNotificationsFromFirestore(userId: string) {
  const path = 'notifications';
  try {
    const notifColl = collection(db, 'notifications');
    const q = query(notifColl, where('userId', '==', userId));
    const qSnap = await getDocs(q);
    const notifications: any[] = [];
    qSnap.forEach((docSnap) => {
      notifications.push(docSnap.data());
    });
    return notifications;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save or update user profile explicitly (called by Admins/Super Admins)
 */
export async function saveUserToFirestore(userData: {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  project: string;
  weeHurRole: string;
  xp?: number;
  completions?: number;
  badges?: string[];
}) {
  const path = `users/${userData.uid}`;
  try {
    const userRef = doc(db, 'users', userData.uid);
    const dataPayload = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      project: userData.project,
      weeHurRole: userData.weeHurRole,
      xp: userData.xp || 0,
      completions: userData.completions || 0,
      badges: userData.badges || [],
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, dataPayload, { merge: true });
    console.log('User profile saved/updated successfully:', userData.uid);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a user profile from Firestore (called by Admins/Super Admins)
 */
export async function deleteUserFromFirestore(userId: string) {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('User profile deleted successfully:', userId);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Save custom project sites list to Firestore (Admins/Super Admins).
 */
export async function saveProjectSitesToFirestore(sites: string[]) {
  const path = 'app_config/project_settings';
  try {
    const configRef = doc(db, 'app_config', 'project_settings');
    await setDoc(configRef, { sites }, { merge: true });
    console.log('Project sites saved successfully to Firestore.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Get custom project sites list from Firestore.
 */
export async function getProjectSitesFromFirestore() {
  const path = 'app_config/project_settings';
  try {
    const configRef = doc(db, 'app_config', 'project_settings');
    const snap = await getDoc(configRef);
    if (snap.exists() && snap.data().sites) {
      return snap.data().sites as string[];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save custom job titles list to Firestore (Admins/Super Admins).
 */
export async function saveWeeHurRolesToFirestore(roles: string[]) {
  const path = 'app_config/job_settings';
  try {
    const configRef = doc(db, 'app_config', 'job_settings');
    await setDoc(configRef, { roles }, { merge: true });
    console.log('Job titles saved successfully to Firestore.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Get custom job titles list from Firestore.
 */
export async function getWeeHurRolesFromFirestore() {
  const path = 'app_config/job_settings';
  try {
    const configRef = doc(db, 'app_config', 'job_settings');
    const snap = await getDoc(configRef);
    if (snap.exists() && snap.data().roles) {
      return snap.data().roles as string[];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}


export function subscribeToLeaderboard(callback: (entries: any[]) => void) {
  const usersColl = collection(db, 'users');
  const unsubscribe = onSnapshot(usersColl, (qSnap) => {
    const entries: any[] = [];
    qSnap.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        name: data.displayName || data.email?.split('@')[0] || 'Learning Officer',
        email: data.email || 'officer@weehur.com.sg',
        xp: data.xp || 0,
        completions: data.completions || 0,
        badges: data.badges || [],
        uid: data.uid,
        role: data.weeHurRole || 'Structural Supervisor',
        site: data.project || 'Kovan Residential',
        accessibilityRole: data.role || 'employee'
      });
    });
    callback(entries);
  }, (error) => {
    console.error("Leaderboard subscription error:", error);
  });
  return unsubscribe;
}
