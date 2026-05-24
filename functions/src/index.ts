
import * as admin from 'firebase-admin';

// Initialize the Admin SDK once
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Export functions from sub-modules
export * from './content';
export * from './user-management';
