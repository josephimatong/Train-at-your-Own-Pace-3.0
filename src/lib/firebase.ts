/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize the Firebase app with the loaded configuration
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and specify the database ID
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.metadata');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.appdata');

// --- Mandatory Firestore Error Handling Implementation ---

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  const isOffline = errInfo.error.toLowerCase().includes('offline');
  if (isOffline) {
    console.warn('Firestore Offline (handled gracefully):', JSON.stringify(errInfo));
  } else {
    console.error('Firestore Error Details:', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    if (token) {
      sessionStorage.setItem('weehur_drive_token', token);
    }
    return result;
  } catch (error) {
    console.error('Google popup sign-in error:', error);
    throw error;
  }
};

/**
 * Validate the Firestore connection as required by safety constraints.
 */
import { doc, getDocFromServer } from 'firebase/firestore';

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection validation succeeded.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline fallback mode.');
    }
  }
}
testConnection();
