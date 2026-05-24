
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

async function assertAdmin(context: functions.https.CallableContext) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }
  const userId = context.auth.uid;
  const userDoc = await db.collection('users').doc(userId).get();
  const isAdmin = userDoc.exists && userDoc.data()?.role === 'admin';
  const hasAdminClaim = context.auth.token.admin === true;
  
  if (!isAdmin && !hasAdminClaim) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can perform this action.');
  }
  return userId;
}

export const adminAddGalleryItem = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const { imageUrl, description } = data;
  if (!imageUrl || !description) throw new functions.https.HttpsError('invalid-argument', 'Missing fields.');
  
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(imageUrl)) throw new functions.https.HttpsError('invalid-argument', 'Invalid image URL.');
  
  const newItem = {
    imageUrl,
    description: description.trim(),
    createdAt: Date.now(),
  };
  const ref = await db.collection('gallery').add(newItem);
  return { id: ref.id, ...newItem };
});

export const adminDeleteGalleryItem = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const { id } = data;
  if (!id) throw new functions.https.HttpsError('invalid-argument', 'Missing id.');
  await db.collection('gallery').doc(id).delete();
  return { success: true };
});

export const adminUpdateGalleryItem = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const { id, imageUrl, description } = data;
  if (!id || !imageUrl || !description) throw new functions.https.HttpsError('invalid-argument', 'Missing fields.');
  
  const updateData = {
    imageUrl,
    description: description.trim(),
    updatedAt: Date.now(),
  };
  await db.collection('gallery').doc(id).update(updateData);
  return { id, ...updateData };
});

export const adminUpdateHeroVideo = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const { videoUrl } = data;
  if (!videoUrl) throw new functions.https.HttpsError('invalid-argument', 'Missing video URL.');
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/|youtu\.be\/)[\w-]+/;
  if (!youtubeRegex.test(videoUrl)) throw new functions.https.HttpsError('invalid-argument', 'Invalid YouTube embed URL.');
  
  await db.collection('settings').doc('general').set({ heroVideoUrl: videoUrl }, { merge: true });
  return { success: true };
});

export const adminUpdateUserRole = functions.https.onCall(async (data, context) => {
  const callerUid = await assertAdmin(context);
  const { targetUserId, newRole } = data;
  if (!targetUserId || !newRole) throw new functions.https.HttpsError('invalid-argument', 'Missing userId or role.');
  if (newRole !== 'admin' && newRole !== 'user') throw new functions.https.HttpsError('invalid-argument', 'Invalid role.');
  
  if (targetUserId === callerUid) {
    throw new functions.https.HttpsError('failed-precondition', 'You cannot change your own role.');
  }
  
  const masterEmail = functions.config().admin?.master_email;
  if (masterEmail) {
    const targetUserDoc = await db.collection('users').doc(targetUserId).get();
    if (targetUserDoc.exists && targetUserDoc.data()?.email === masterEmail) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot modify the master administrator.');
    }
  }
  
  await db.collection('users').doc(targetUserId).update({ role: newRole });
  await admin.auth().setCustomUserClaims(targetUserId, { admin: newRole === 'admin' });
  return { success: true };
});

export const adminBootstrapMaster = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  const uid = context.auth.uid;
  const email = context.auth.token.email;
  const masterEmail = functions.config().admin?.master_email || 'orverxi@gmail.com';
  
  if (email !== masterEmail) {
    throw new functions.https.HttpsError('permission-denied', 'Email not authorized to bootstrap.');
  }
  
  await db.collection('users').doc(uid).set({
    email,
    displayName: context.auth.token.name || 'Admin',
    role: 'admin',
    lastLogin: Date.now(),
    isMaster: true
  }, { merge: true });
  
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});
