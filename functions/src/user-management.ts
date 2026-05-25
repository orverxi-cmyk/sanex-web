
import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Helper to verify admin privileges.
 */
async function assertAdmin(request: CallableRequest) {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in.');
  }
  const userId = request.auth.uid;
  const userDoc = await db.collection('users').doc(userId).get();
  const isAdmin = userDoc.exists && userDoc.data()?.role === 'admin';
  const hasAdminClaim = request.auth.token.admin === true;
  
  if (!isAdmin && !hasAdminClaim) {
    throw new HttpsError('permission-denied', 'Only admins can perform this action.');
  }
  return userId;
}

export const adminUpdateUserRole = onCall({ cors: true }, async (request: CallableRequest) => {
  const callerUid = await assertAdmin(request);
  const { targetUserId, newRole } = request.data;
  if (!targetUserId || !newRole) throw new HttpsError('invalid-argument', 'Missing userId or role.');
  if (newRole !== 'admin' && newRole !== 'user') throw new HttpsError('invalid-argument', 'Invalid role.');
  
  if (targetUserId === callerUid) {
    throw new HttpsError('failed-precondition', 'You cannot change your own role.');
  }
  
  const masterEmail = 'orverxi@gmail.com'; 
  
  const targetUserDoc = await db.collection('users').doc(targetUserId).get();
  if (targetUserDoc.exists && targetUserDoc.data()?.email === masterEmail) {
    throw new HttpsError('permission-denied', 'Cannot modify the master administrator.');
  }
  
  await db.collection('users').doc(targetUserId).update({ role: newRole });
  await admin.auth().setCustomUserClaims(targetUserId, { admin: newRole === 'admin' });
  return { success: true };
});

export const adminBootstrapMaster = onCall({ cors: true }, async (request: CallableRequest) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Must be logged in.');
  
  const uid = request.auth.uid;
  const email = request.auth.token.email;
  const masterEmail = 'orverxi@gmail.com';
  
  if (email !== masterEmail) {
    throw new HttpsError('permission-denied', 'Email not authorized to bootstrap.');
  }
  
  await db.collection('users').doc(uid).set({
    email,
    displayName: request.auth.token.name || 'Admin',
    role: 'admin',
    lastLogin: Date.now(),
    isMaster: true
  }, { merge: true });
  
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});
