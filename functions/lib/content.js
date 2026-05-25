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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateBookingStatus = exports.createBooking = exports.adminUpdateSiteSection = exports.adminDeleteGalleryItem = exports.adminAddGalleryItem = exports.adminUpdateArticle = exports.adminDeleteArticle = exports.adminAddArticle = exports.adminSeedInitialData = void 0;
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
exports.adminSeedInitialData = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const batch = db.batch();
    // General Settings
    batch.set(db.collection('settings').doc('general'), {
        siteName: "SANEX Company Ltd",
        logoUrl: "https://picsum.photos/seed/sanexlogo/200/200",
        logoWidth: 160,
        logoHeight: 40,
        logoSpacing: 8,
        phone: "+250 788303628",
        email: "info@sanex.rw"
    });
    // Articles Seeding (Impact Stories)
    const articleRef = db.collection('articles').doc('kigali-waste-management-2024');
    batch.set(articleRef, {
        title: "Revolutionizing Waste Management in Kigali",
        excerpt: "How SANEX transformed liquid waste collection for over 50 schools in the capital.",
        content: "Detailed story about our 2024 project in Kigali... [More content here]",
        imageUrl: "https://picsum.photos/seed/impact1/1200/600",
        imageWidth: 1200,
        imageHeight: 600,
        category: "Impact",
        author: "SANEX Editorial",
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    // Slider Section
    batch.set(db.collection('settings').doc('slider'), {
        items: [
            {
                title: "Liquid Waste Collection",
                description: "Modern vacuum trucks serving schools, hospitals, and hotels across Rwanda.",
                imageUrl: "https://picsum.photos/seed/sanexslide1/1200/600",
                width: 1200,
                height: 600,
                link: "/services",
                buttonText: "Our Solutions"
            },
            {
                title: "Clean Water Reuse",
                description: "Advanced DWTS systems using activated sludge technology for irrigation.",
                imageUrl: "https://picsum.photos/seed/sanexslide2/1200/600",
                width: 1200,
                height: 600,
                link: "/articles",
                buttonText: "Environmental Impact"
            }
        ]
    });
    // Hero Section
    batch.set(db.collection('settings').doc('hero'), {
        badge: "Leading Sanitation Partner in Rwanda",
        title: "Transforming",
        titleAccent: "Waste Into Opportunity",
        description: "Leading Liquid Waste Management Solutions in Rwanda. We protect public health and environmental integrity through advanced technology and nationwide coverage.",
        imageUrl: "https://picsum.photos/seed/sanex1/1200/800",
        imageWidth: 1200,
        imageHeight: 800,
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
            { title: "Liquid Waste Collection", description: "Modern vacuum trucks for efficient waste collection serving schools, hospitals, and hotels.", icon: "truck", imageUrl: "https://picsum.photos/seed/sanex2/800/600", width: 800, height: 600 },
            { title: "Installation of DWTS", description: "Advanced systems for clean water reuse in irrigation and flushing using activated sludge technology.", icon: "droplets", imageUrl: "https://picsum.photos/seed/sanex3/800/600", width: 800, height: 600 },
            { title: "Maintenance & Consultancy", description: "Quarterly maintenance services and expert advice for optimal wastewater management.", icon: "settings", imageUrl: "https://picsum.photos/seed/sanex4/800/600", width: 800, height: 600 }
        ]
    });
    // Impact Section
    batch.set(db.collection('settings').doc('impact'), {
        title: "Impact Since Our Inception",
        subtitle: "Since its establishment in 2017, SANEX Company Ltd has made a significant impact in addressing the challenges of liquid waste management across Rwanda.",
        items: [
            { title: "Environmental", icon: "leaf", points: ["Preventing pollutants from contaminating ecosystems", "Cleaner water sources via DWTS"] },
            { title: "Public Health", icon: "heart", points: ["Reducing waterborne diseases", "Safety awareness campaigns"] }
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
    await batch.commit();
    return { success: true };
});
exports.adminAddArticle = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { title, content, excerpt, imageUrl, imageWidth, imageHeight, category, author } = request.data;
    if (!title || !content)
        throw new https_1.HttpsError('invalid-argument', 'Title and content are required.');
    const newItem = {
        title,
        content,
        excerpt: excerpt || '',
        imageUrl: imageUrl || '',
        imageWidth: Number(imageWidth) || 1200,
        imageHeight: Number(imageHeight) || 600,
        category: category || 'General',
        author: author || 'Admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    const ref = await db.collection('articles').add(newItem);
    return Object.assign({ id: ref.id }, newItem);
});
exports.adminDeleteArticle = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { id } = request.data;
    if (!id)
        throw new https_1.HttpsError('invalid-argument', 'Missing id.');
    await db.collection('articles').doc(id).delete();
    return { success: true };
});
exports.adminUpdateArticle = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const _a = request.data, { id } = _a, data = __rest(_a, ["id"]);
    if (!id)
        throw new https_1.HttpsError('invalid-argument', 'Missing id.');
    const updateData = Object.assign(Object.assign({}, data), { imageWidth: Number(data.imageWidth) || 1200, imageHeight: Number(data.imageHeight) || 600, updatedAt: Date.now() });
    await db.collection('articles').doc(id).update(updateData);
    return Object.assign({ id }, updateData);
});
exports.adminAddGalleryItem = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { imageUrl, description, width, height } = request.data;
    if (!imageUrl || !description)
        throw new https_1.HttpsError('invalid-argument', 'Missing fields.');
    const newItem = {
        imageUrl,
        description: description.trim(),
        width: Number(width) || 800,
        height: Number(height) || 600,
        createdAt: Date.now(),
    };
    const ref = await db.collection('gallery').add(newItem);
    return Object.assign({ id: ref.id }, newItem);
});
exports.adminDeleteGalleryItem = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { id } = request.data;
    if (!id)
        throw new https_1.HttpsError('invalid-argument', 'Missing id.');
    await db.collection('gallery').doc(id).delete();
    return { success: true };
});
exports.adminUpdateSiteSection = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { sectionId, content } = request.data;
    if (!sectionId || !content)
        throw new https_1.HttpsError('invalid-argument', 'Missing sectionId or content.');
    await db.collection('settings').doc(sectionId).set(content, { merge: true });
    return { success: true };
});
exports.createBooking = (0, https_1.onCall)({ cors: true }, async (request) => {
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
exports.adminUpdateBookingStatus = (0, https_1.onCall)({ cors: true }, async (request) => {
    await assertAdmin(request);
    const { bookingId, status } = request.data;
    if (!bookingId || !status)
        throw new https_1.HttpsError('invalid-argument', 'Missing bookingId or status.');
    await db.collection('bookings').doc(bookingId).update({ status });
    return { success: true };
});
//# sourceMappingURL=content.js.map