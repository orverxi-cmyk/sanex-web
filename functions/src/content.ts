
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Helper to verify admin privileges.
 */
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
