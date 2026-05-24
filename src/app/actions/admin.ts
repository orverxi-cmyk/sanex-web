
'use server';

/**
 * @fileOverview Server Actions for administrative tasks.
 * These functions run on the server, preventing client-side tampering.
 */

import { z } from 'zod';
import { initializeFirebase } from '@/firebase/init';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const MASTER_ADMIN_EMAIL = process.env.MASTER_ADMIN_EMAIL || "orverxi@gmail.com";

const RoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'user']),
});

/**
 * Verifies if the requester is an authorized admin.
 * In a production app, this would check custom claims or a secure session.
 */
async function verifyAdmin(requesterUid: string) {
  const { firestore } = initializeFirebase();
  const requesterDoc = await getDoc(doc(firestore, "users", requesterUid));
  const data = requesterDoc.data();
  return data?.role === "admin";
}

export async function bootstrapMasterAdmin(userId: string, email: string, displayName: string) {
  if (email !== MASTER_ADMIN_EMAIL) {
    throw new Error("Access denied: Email does not match master administrator.");
  }

  const { firestore } = initializeFirebase();
  const userRef = doc(firestore, "users", userId);
  
  await setDoc(userRef, {
    email,
    displayName,
    role: "admin",
    lastLogin: Date.now(),
    isMaster: true
  }, { merge: true });

  return { success: true };
}

export async function updateUserRole(requesterUid: string, targetUserId: string, newRole: 'admin' | 'user') {
  // Server-side check: Only admins can change roles
  const isAdmin = await verifyAdmin(requesterUid);
  if (!isAdmin) {
    throw new Error("Unauthorized: Only administrators can modify roles.");
  }

  const { firestore } = initializeFirebase();
  const targetRef = doc(firestore, "users", targetUserId);
  
  // Protect the master admin from being demoted
  const targetDoc = await getDoc(targetRef);
  if (targetDoc.data()?.isMaster) {
    throw new Error("Forbidden: Master administrator role cannot be altered.");
  }

  await updateDoc(targetRef, { role: newRole });
  return { success: true };
}
