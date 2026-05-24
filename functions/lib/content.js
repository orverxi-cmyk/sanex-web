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
exports.adminUpdateBookingStatus = exports.createBooking = exports.adminUpdateSiteSection = exports.adminUpdateGalleryItem = exports.adminDeleteGalleryItem = exports.adminAddGalleryItem = exports.adminSeedInitialData = void 0;
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
exports.adminSeedInitialData = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const batch = db.batch();
    // Hero Section
    batch.set(db.collection('settings').doc('hero'), {
        badge: "Leading Sanitation Partner in Rwanda",
        title: "Transforming",
        titleAccent: "Waste Into Opportunity",
        description: "Leading Liquid Waste Management Solutions in Rwanda. We protect public health and environmental integrity through advanced technology and nationwide coverage.",
        imageUrl: "https://picsum.photos/seed/sanex1/1200/800",
        ctaText: "Book a Service",
        ctaLink: "/book"
    });
    // Highlights Section
    batch.set(db.collection('settings').doc('highlights'), {
        items: [
            { icon: "shield", title: "Licensed Since 2021", description: "Trusted by over 114 clients nationwide with verified operational standards." },
            { icon: "cpu", title: "Advanced Technology", description: "Eco-friendly wastewater treatment systems using activated sludge technology." },
            { icon: "globe", title: "Nationwide Coverage", description: "Serving urban and rural communities from Kigali to Musanze and Huye." }
        ]
    });
    // Services Section
    batch.set(db.collection('settings').doc('services'), {
        title: "Comprehensive Liquid Waste Solutions",
        subtitle: "At SANEX, we offer a full suite of services designed to promote public health and sustainable environmental growth.",
        items: [
            { title: "Liquid Waste Collection", description: "Modern vacuum trucks for efficient waste collection serving schools, hospitals, and hotels.", icon: "truck", imageUrl: "https://picsum.photos/seed/sanex2/800/600" },
            { title: "Installation of DWTS", description: "Advanced systems for clean water reuse in irrigation and flushing using activated sludge technology.", icon: "droplets", imageUrl: "https://picsum.photos/seed/sanex3/800/600" },
            { title: "Maintenance & Consultancy", description: "Quarterly maintenance services and expert advice for optimal wastewater management.", icon: "settings", imageUrl: "https://picsum.photos/seed/sanex4/800/600" },
            { title: "Sanitation Projects", description: "Collaborating with government and private organizations to promote public health.", icon: "users", imageUrl: "https://picsum.photos/seed/sanex6/800/600" }
        ]
    });
    // Impact Section
    batch.set(db.collection('settings').doc('impact'), {
        title: "Impact Since Our Inception",
        subtitle: "Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.",
        items: [
            { title: "Environmental", icon: "leaf", points: ["Preventing pollutants from contaminating ecosystems", "Cleaner water sources via DWTS"] },
            { title: "Public Health", icon: "heart", points: ["Reducing waterborne diseases", "Safety awareness campaigns"] },
            { title: "Community", icon: "users", points: ["Directly created jobs for skilled workers", "Local capacity training programs"] }
        ]
    });
    // Milestones Section
    batch.set(db.collection('settings').doc('milestones'), {
        title: "Who We Are",
        description: "SANEX Company Ltd is dedicated to delivering comprehensive liquid waste management solutions across Rwanda...",
        items: [
            { year: "2017", title: "Founding", description: "Established to address liquid waste challenges.", icon: "clock" },
            { year: "2021", title: "Licensing", description: "Achieved official transport licensing.", icon: "shield" },
            { year: "2024", title: "Expansion", description: "Launched DWTS services nationwide.", icon: "rocket" }
        ]
    });
    // Regional Section
    batch.set(db.collection('settings').doc('regional'), {
        title: "Regional Availability Portal",
        description: "Establishing operational offices in key towns across Rwanda...",
        items: [
            { name: "Kigali", status: "Operational Headquarters", capacity: "Full Fleet" },
            { name: "Musanze", status: "Strategic Hub", capacity: "Service Center" },
            { name: "Huye", status: "Planned Expansion", capacity: "Regional Office" }
        ]
    });
    // Video Section
    batch.set(db.collection('settings').doc('video'), {
        title: "SANEX in Action",
        description: "Watch our specialized vacuum trucks and decentralized treatment systems in action across Rwanda.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    });
    await batch.commit();
    return { success: true };
});
exports.adminAddGalleryItem = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { imageUrl, description } = request.data;
    if (!imageUrl || !description)
        throw new https_1.HttpsError('invalid-argument', 'Missing fields.');
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
exports.adminUpdateSiteSection = (0, https_1.onCall)(async (request) => {
    await assertAdmin(request);
    const { sectionId, content } = request.data;
    if (!sectionId || !content)
        throw new https_1.HttpsError('invalid-argument', 'Missing sectionId or content.');
    await db.collection('settings').doc(sectionId).set(content, { merge: true });
    return { success: true };
});
exports.createBooking = (0, https_1.onCall)(async (request) => {
    const { customerName, email, phone, serviceType, locationUrl, description } = request.data;
    if (!customerName || !email || !phone || !serviceType || !locationUrl) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required booking fields.');
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