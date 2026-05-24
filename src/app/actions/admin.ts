'use server';

/**
 * Administrative server actions have been migrated to Firebase Cloud Functions 
 * for enhanced security and to avoid client SDK environment mismatches 
 * during server-side rendering.
 */

export async function bootstrapMasterAdmin() {
  throw new Error("This action is deprecated. Use the Cloud Function adminBootstrapMaster instead.");
}

export async function updateUserRole() {
  throw new Error("This action is deprecated. Use the Cloud Function adminUpdateUserRole instead.");
}
