"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateBookingStatus = exports.createBooking = exports.adminUpdateHeroVideo = exports.adminUpdateGalleryItem = exports.adminDeleteGalleryItem = exports.adminAddGalleryItem = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Helper to verify admin privileges.
 */
async function assertAdmin(request) {
    var _a;
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be logged in.');
    }
    const userId = request.auth.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const isAdmin = userDoc.exists && ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const hasAdminClaim = request.auth.token.admin === true;
    if (!isAdmin && !hasAdminClaim) {
        throw new https_1.HttpsError('permission-denied', 'Only admins can perform this action.');
    }
    return userId;
}
exports.adminAddGalleryItem = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { imageUrl, description } = request.data;
    if (!imageUrl || !description)
        throw new https_1.HttpsError('invalid-argument', 'Missing fields.');
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(imageUrl))
        throw new https_1.HttpsError('invalid-argument', 'Invalid image URL.');
    const newItem = {
        imageUrl,
        description: description.trim(),
        createdAt: Date.now(),
    };
    const ref = await db.collection('gallery').add(newItem);
    return Object.assign({ id: ref.id }, newItem);
});
exports.adminDeleteGalleryItem = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { id } = request.data;
    if (!id)
        throw new https_1.HttpsError('invalid-argument', 'Missing id.');
    await db.collection('gallery').doc(id).delete();
    return { success: true };
});
exports.adminUpdateGalleryItem = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { id, imageUrl, description } = request.data;
    if (!id || !imageUrl || !description)
        throw new https_1.HttpsError('invalid-argument', 'Missing fields.');
    const updateData = {
        imageUrl,
        description: description.trim(),
        updatedAt: Date.now(),
    };
    await db.collection('gallery').doc(id).update(updateData);
    return Object.assign({ id }, updateData);
});
exports.adminUpdateHeroVideo = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { videoUrl } = request.data;
    if (!videoUrl)
        throw new https_1.HttpsError('invalid-argument', 'Missing video URL.');
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(videoUrl))
        throw new https_1.HttpsError('invalid-argument', 'Invalid YouTube embed URL.');
    await db.collection('settings').doc('general').set({ heroVideoUrl: videoUrl }, { merge: true });
    return { success: true };
});
exports.createBooking = (0, https_1.onCall)(async (request) => {
    const { customerName, email, phone, serviceType, locationUrl, description } = request.data;
    if (!customerName || !email || !phone || !serviceType || !locationUrl) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required booking fields, including location.');
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
exports.adminUpdateBookingStatus = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { bookingId, status } = request.data;
    if (!bookingId || !status)
        throw new https_1.HttpsError('invalid-argument', 'Missing bookingId or status.');
    await db.collection('bookings').doc(bookingId).update({ status });
    return { success: true };
});
//# sourceMappingURL=content.js.map