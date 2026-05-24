
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * A secure cloud function to manage user roles.
 * This should be deployed via Firebase CLI.
 */
export const manageUserRole = functions.https.onCall(async (data, context) => {
  // 1. Verify Authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  // 2. Verify Requester is an Admin
  const requesterDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (requesterDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can modify roles.');
  }

  const { targetUserId, newRole } = data;

  // 3. Validation
  if (!targetUserId || !['admin', 'user'].includes(newRole)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid target user or role.');
  }

  // 4. Protect Master Admin
  const targetDoc = await admin.firestore().collection('users').doc(targetUserId).get();
  if (targetDoc.data()?.isMaster) {
    throw new functions.https.HttpsError('permission-denied', 'Cannot modify the master administrator.');
  }

  // 5. Update Role and Custom Claims
  await admin.firestore().collection('users').doc(targetUserId).update({ role: newRole });
  
  // Optionally set custom claims for even stronger security
  await admin.auth().setCustomUserClaims(targetUserId, { admin: newRole === 'admin' });

  return { success: true, message: `Role updated to ${newRole}` };
});
