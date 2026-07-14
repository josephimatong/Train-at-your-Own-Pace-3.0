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
  const token = await getAccessToken();
  if (!token) {
    console.warn('No Google Drive access token found. Skipping listDriveFiles API call.');
    return [];
  }

  let q = "trashed=false and 'corporateinfo.cons@weehur.com.sg' in owners";
  if (query) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }
  const params = new URLSearchParams({
    pageSize: '12',
    fields: 'files(id,name,mimeType,size,createdTime,thumbnailLink,webContentLink,webViewLink)',
    q: q
  });
  const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      // Automatic token clearing when unauthorized (expired)
      cachedAccessToken = null;
      sessionStorage.removeItem('weehur_drive_token');
      throw new Error('Google Drive access expired or invalid. Please sign in with Google again.');
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to list Google Drive files:', errText);
      throw new Error(`Google Drive API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (err: any) {
    if (err.message && err.message.includes('expired or invalid')) {
      console.warn('Google Drive access expired or invalid. Token cleared.');
    } else {
      console.error('Failed to retrieve Google Drive files:', err.message);
    }
    throw err;
  }
};

/**
 * Upload study notes to Google Drive.
 */
export const uploadDriveFile = async (fileName: string, content: string, mimeType: string = 'text/plain'): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive. Please link Google Drive.');

  // Step 1: Create metadata to get the file ID
  const metadataRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: fileName,
      mimeType: mimeType,
    }),
  });

  if (metadataRes.status === 401) {
    cachedAccessToken = null;
    sessionStorage.removeItem('weehur_drive_token');
    throw new Error('Google Drive access expired or invalid. Please link Google Drive again.');
  }

  if (!metadataRes.ok) {
    const errText = await metadataRes.text();
    console.error('Failed to create file metadata in Google Drive:', errText);
    throw new Error(`Failed to create Google Drive file: ${metadataRes.statusText}`);
  }

  const file = await metadataRes.json();

  // Step 2: Upload actual media/text content
  const contentRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': mimeType,
    },
    body: content,
  });

  if (contentRes.status === 401) {
    cachedAccessToken = null;
    sessionStorage.removeItem('weehur_drive_token');
    throw new Error('Google Drive access expired or invalid. Please link Google Drive again.');
  }

  if (!contentRes.ok) {
    const errText = await contentRes.text();
    console.error('Failed to upload file content to Google Drive:', errText);
    throw new Error(`Failed to upload Google Drive content: ${contentRes.statusText}`);
  }

  return file.id;
};

/**
 * Securely updates the current user's profile display name and password inside Firebase Auth.
 */
export const updateUserAccountDetails = async (
  displayName: string,
  newPassword?: string
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No authenticated user found. Please sign in first.');

  // 1. Update Display Name if provided and changed
  if (displayName && displayName.trim() && displayName.trim() !== currentUser.displayName) {
    await updateProfile(currentUser, { displayName: displayName.trim() });
  }

  // 2. Update Password if provided
  if (newPassword && newPassword.trim()) {
    try {
      await updatePassword(currentUser, newPassword.trim());
    } catch (error: any) {
      if (error && (error.code === 'auth/requires-recent-login' || error.message?.includes('requires-recent-login'))) {
        throw new Error('For security reasons, please sign out and sign in again before changing your password.');
      }
      if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
        throw new Error(
          "Email/Password authentication is disabled in your Firebase project. To enable password updating:\n" +
          "1. Go to Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0509544687/authentication/providers\n" +
          "2. Click 'Add new provider' and select 'Email/Password'.\n" +
          "3. Enable the 'Email/Password' switch and save the changes."
        );
      }
      throw error;
    }
  }
};

