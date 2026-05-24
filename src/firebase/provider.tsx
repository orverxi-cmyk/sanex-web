
'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Functions } from 'firebase/functions';

interface FirebaseContextProps {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  functions: Functions | null;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  firebaseApp: null,
  firestore: null,
  auth: null,
  functions: null,
});

export const FirebaseProvider: React.FC<{
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  functions: Functions;
  children: React.ReactNode;
}> = ({ firebaseApp, firestore, auth, functions, children }) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth, functions }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context.firebaseApp) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  return context.firestore;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  return { auth: context.auth };
};

export const useFunctions = () => {
  const context = useContext(FirebaseContext);
  return context.functions;
};
