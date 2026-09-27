'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData,
  refEqual
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const prevRef = useState<{ current: DocumentReference<T> | null }>({ current: null })[0];

  useEffect(() => {
    if (!docRef) {
      prevRef.current = null;
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (prevRef.current && refEqual(prevRef.current, docRef)) {
      return;
    }

    prevRef.current = docRef;
    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data()!, id: snapshot.id } : null);
        setLoading(false);
        setError(null);
      },
      (serverError) => {
        console.warn("Firestore doc error:", serverError);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [docRef]);

  return { data, loading, error };
}
