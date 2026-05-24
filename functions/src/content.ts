
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

export const adminAddGalleryItem = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);
  const { imageUrl, description } = request.data;
  if (!imageUrl || !description) throw new HttpsError('invalid-argument', 'Missing fields.');
  
  const newItem = {
    imageUrl,
    description: description.trim(),
    createdAt: Date.now(),
  };
  const ref = await db.collection('gallery').add(newItem);
  return { id: ref.id, ...newItem };
});

export const adminDeleteGalleryItem = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'Missing id.');
  await db.collection('gallery').doc(id).delete();
  return { success: true };
});

export const adminUpdateGalleryItem = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id, imageUrl, description } = request.data;
  if (!id || !imageUrl || !description) throw new HttpsError('invalid-argument', 'Missing fields.');
  
  const updateData = {
    imageUrl,
    description: description.trim(),
    updatedAt: Date.now(),
  };
  await db.collection('gallery').doc(id).update(updateData);
  return { id, ...updateData };
});

export const adminUpdateSiteSection = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);
  const { sectionId, content } = request.data;
  if (!sectionId || !content) throw new HttpsError('invalid-argument', 'Missing sectionId or content.');
  
  await db.collection('settings').doc(sectionId).set(content, { merge: true });
  return { success: true };
});

export const createBooking = onCall(async (request: CallableRequest) => {
  const { customerName, email, phone, serviceType, locationUrl, description } = request.data;
  if (!customerName || !email || !phone || !serviceType || !locationUrl) {
    throw new HttpsError('invalid-argument', 'Missing required booking fields.');
  }

  const booking = {
    customerName,
    email,
    phone,
    serviceType,
    locationUrl,
    description: description || '',
    status: 'pending',
    createdAt: Date.now(),
  };

  const ref = await db.collection('bookings').add(booking);
  return { id: ref.id };
});

export const adminUpdateBookingStatus = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);
  const { bookingId, status } = request.data;
  if (!bookingId || !status) throw new HttpsError('invalid-argument', 'Missing bookingId or status.');
  
  await db.collection('bookings').doc(bookingId).update({ status });
  return { success: true };
});
