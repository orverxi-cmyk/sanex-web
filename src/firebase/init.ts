import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  functions: Functions;
} {
  // Ensure Firebase is initialized only once
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Note: These services are primarily intended for client-side use in this project.
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);

  return { firebaseApp, firestore, auth, functions };
}
