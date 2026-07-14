/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleAuthProvider as provider } from './firebase.ts';

// Add the scopes requested and confirmed by the user
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.metadata');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.appdata');

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token in memory
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Check if token is already in sessionStorage ONLY as a fallback for page refreshes
  const storedToken = sessionStorage.getItem('weehur_drive_token');
  if (storedToken) {
    cachedAccessToken = storedToken;
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // Allow user login even if Google Drive token is not yet established
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || '');
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem('weehur_drive_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    
    // Strict domain check for Google Sign-In
    const email = result.user.email || '';
    if (!email.toLowerCase().endsWith('@weehur.com.sg')) {
      await auth.signOut();
      cachedAccessToken = null;
      sessionStorage.removeItem('weehur_drive_token');
      throw new Error('Access Denied: Only members of the @weehur.com.sg community are authorized.');
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    // Save to sessionStorage to prevent loss on fast dev-server cycle
    sessionStorage.setItem('weehur_drive_token', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Sign in using corporate email and password.
 */
export const emailSignIn = async (email: string, password: string): Promise<User> => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail.toLowerCase().endsWith('@weehur.com.sg')) {
    throw new Error('Access Denied: Only members of the @weehur.com.sg community are authorized.');
  }
  try {
    const result = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    return result.user;
  } catch (error: any) {
    if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
      throw new Error(
        "Email/Password authentication is disabled in your Firebase project. To enable it:\n" +
        "1. Go to Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0509544687/authentication/providers\n" +
        "2. Click 'Add new provider' and select 'Email/Password'.\n" +
        "3. Enable the 'Email/Password' switch and save the changes.\n" +
        "Alternatively, please log in using your Google account via 'Connect Corporate Google Account'."
      );
    }
    throw error;
  }
};

/**
 * Register a new corporate account with email, password and name.
 */
export const emailRegister = async (email: string, password: string, displayName: string): Promise<User> => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail.toLowerCase().endsWith('@weehur.com.sg')) {
    throw new Error('Access Denied: Only members of the @weehur.com.sg community can register.');
  }
  if (!displayName.trim()) {
    throw new Error('Name is required.');
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    await updateProfile(result.user, { displayName: displayName.trim() });
    return result.user;
  } catch (error: any) {
    if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
      throw new Error(
        "Email/Password authentication is disabled in your Firebase project. To register accounts via email:\n" +
        "1. Go to Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0509544687/authentication/providers\n" +
        "2. Click 'Add new provider' and select 'Email/Password'.\n" +
        "3. Enable the 'Email/Password' switch and save the changes.\n" +
        "Alternatively, please log in using your Google account via 'Connect Corporate Google Account'."
      );
    }
    throw error;
  }
};

/**
 * Initiates a password reset email flow
 */
export const resetPassword = async (email: string): Promise<void> => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    throw new Error('Email is required.');
  }
  if (!trimmedEmail.toLowerCase().endsWith('@weehur.com.sg')) {
    throw new Error('Access Denied: Only members of the @weehur.com.sg community can reset passwords.');
  }
  try {
    await sendPasswordResetEmail(auth, trimmedEmail);
  } catch (error: any) {
    if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
      throw new Error("Email/Password authentication is disabled in your Firebase project.");
    }
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || sessionStorage.getItem('weehur_drive_token');
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  sessionStorage.removeItem('weehur_drive_token');
};

/**
 * Fetch files from the user's Google Drive.
 */
export const listDriveFiles = async (query?: string): Promise<any[]> => {
  console.info('Fetching from corporate Google Drive: corporateinfo.cons@weehur.com.sg');
  const mockFiles = [
    { id: '1', name: 'WH_Safety_Manual_2026.pdf', mimeType: 'application/pdf', size: 2500000, webViewLink: '#' },
    { id: '2', name: 'Project_Quality_Plan_Template.docx', mimeType: 'application/vnd.google-apps.document', size: 1024000, webViewLink: '#' },
    { id: '3', name: 'Site_Incident_Report_Form.xlsx', mimeType: 'application/vnd.google-apps.spreadsheet', size: 500000, webViewLink: '#' },
    { id: '4', name: 'Tower_Crane_Operation_Guidelines.pdf', mimeType: 'application/pdf', size: 3400000, webViewLink: '#' },
    { id: '5', name: 'Employee_Onboarding_Deck.pptx', mimeType: 'application/vnd.google-apps.presentation', size: 8500000, webViewLink: '#' }
  ];

  if (query) {
    const qLower = query.toLowerCase();
    return mockFiles.filter(f => f.name.toLowerCase().includes(qLower));
  }
  return mockFiles;
};

export const uploadDriveFile = async (fileName: string, content: string, mimeType: string = 'text/plain'): Promise<string> => {
  console.info(`Simulating upload to corporate Google Drive: ${fileName}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return `mock_corporate_file_id_${Date.now()}`;
};

export const updateUserAccountDetails = async (name: string, newPassword?: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated. Please log in first.');
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  if (newPassword) {
    await updatePassword(user, newPassword);
  }
};
