
import { onCall, HttpsError, CallableRequest, onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * CORS helper for v2 onRequest functions.
 */
function setCorsHeaders(req: any, res: any) {
  const origin = req.headers.origin;
  res.set('Access-Control-Allow-Origin', origin || '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
}

/**
 * Existing Callable assertAdmin
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

export const adminSeedInitialData = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);

  const batch = db.batch();

  batch.set(db.collection('settings').doc('general'), {
    siteName: "SANEX Company Ltd",
    logoUrl: "/logo.png",
    logoWidth: 160,
    logoHeight: 40,
    logoSpacing: 8,
    phone: "+250 788303628",
    email: "sanexcompany@gmail.com",
    socials: {
      twitter: "https://twitter.com/sanex_rw",
      linkedin: "https://linkedin.com/company/sanex-rw",
      facebook: "https://facebook.com/sanex.rw",
      instagram: "https://instagram.com/sanex_rw"
    },
    navLinks: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Articles", href: "/articles" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact", href: "/contact" },
    ]
  });

  const articleRef = db.collection('articles').doc('kigali-waste-management-2024');
  batch.set(articleRef, {
    title: "Our Services",
    excerpt: "At SANEX Company Ltd, we pride ourselves on offering a comprehensive suite of liquid waste management services tailored to meet the diverse needs of our clients.",
    content: "Detailed story about our services and wastewater management across Rwanda...",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9595184890-5bb3c.firebasestorage.app/o/uploads%2F1779810108618_ifoto15.jpg?alt=media&token=80beb761-c45a-4f47-9c7c-2013fea44f65",
    imageWidth: 1200,
    imageHeight: 600,
    category: "Impact",
    author: "SANEX Editorial",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  batch.set(db.collection('settings').doc('slider'), {
    items: [
      { 
        title: "Liquid Waste Collection", 
        description: "<p>Modern vacuum trucks serving schools, hospitals, and hotels across Rwanda.</p>", 
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9595184890-5bb3c.firebasestorage.app/o/uploads%2F1780321287848_B25A3099.jpg?alt=media&token=d3048d2c-2d02-4fdb-8eaa-f741686a4401",
        width: 1200,
        height: 600,
        link: "/services",
        buttonText: "Our Solutions"
      }
    ]
  });

  batch.set(db.collection('settings').doc('hero'), {
    badge: "Leading Sanitation Partner in Rwanda",
    title: "Transforming",
    titleAccent: "Waste Into Opportunity",
    description: "Leading Liquid Waste Management Solutions in Rwanda.",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-9595184890-5bb3c.firebasestorage.app/o/uploads%2F1779799776154_B25A3083.jpg?alt=media&token=f390e684-ab5b-4ff1-aa5d-fd95f4512e93",
    imageWidth: 1200,
    imageHeight: 800,
    ctaText: "Book a Service",
    ctaLink: "/book"
  });

  await batch.commit();
  return { success: true };
});

export const adminAddArticle = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { title, content, excerpt, imageUrl, imageWidth, imageHeight, category, author } = request.data;
  if (!title || !content) throw new HttpsError('invalid-argument', 'Title and content are required.');
  
  const newItem = {
    title,
    content,
    excerpt: excerpt || '',
    imageUrl: imageUrl || '',
    imageWidth: Number(imageWidth) || 1200,
    imageHeight: Number(imageHeight) || 600,
    category: category || 'Impact',
    author: author || 'Admin',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const ref = await db.collection('articles').add(newItem);
  return { id: ref.id, ...newItem };
});

export const adminDeleteArticle = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'Missing id.');
  await db.collection('articles').doc(id).delete();
  return { success: true };
});

export const adminUpdateArticle = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id, ...data } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'Missing id.');
  
  const updateData = {
    ...data,
    imageWidth: Number(data.imageWidth) || 1200,
    imageHeight: Number(data.imageHeight) || 600,
    updatedAt: Date.now(),
  };
  await db.collection('articles').doc(id).update(updateData);
  return { id, ...updateData };
});

/**
 * Gallery Management via Callable Functions
 */
export const adminAddGalleryItem = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { imageUrl, description, width, height } = request.data;
  if (!imageUrl || !description) throw new HttpsError('invalid-argument', 'Image URL and description are required.');
  
  const newItem = {
    imageUrl,
    description: description.trim(),
    width: Number(width) || 800,
    height: Number(height) || 600,
    createdAt: Date.now(),
  };
  const ref = await db.collection('gallery').add(newItem);
  return { id: ref.id, ...newItem };
});

export const adminUpdateGalleryItem = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id, imageUrl, description, width, height } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'Missing id.');
  
  const updateData = {
    imageUrl,
    description: description?.trim(),
    width: Number(width) || 800,
    height: Number(height) || 600,
    updatedAt: Date.now()
  };
  await db.collection('gallery').doc(id).update(updateData);
  return { id, ...updateData };
});

export const adminDeleteGalleryItem = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { id } = request.data;
  if (!id) throw new HttpsError('invalid-argument', 'Missing id.');
  await db.collection('gallery').doc(id).delete();
  return { success: true };
});

export const adminUpdateSiteSection = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { sectionId, content } = request.data;
  if (!sectionId || !content) throw new HttpsError('invalid-argument', 'Missing sectionId or content.');
  
  await db.collection('settings').doc(sectionId).set(content, { merge: true });
  return { success: true };
});

export const createBooking = onRequest({ cors: true }, async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { customerName, email, phone, serviceType, locationUrl, description, appointmentDate, preferredTime, referralSource } = req.body;
    if (!customerName || !email || !phone || !serviceType || !locationUrl) {
      res.status(400).json({ error: 'Missing required booking fields' });
      return;
    }
    
    const booking = {
      customerName,
      email,
      phone,
      serviceType,
      locationUrl,
      description: description || '',
      appointmentDate: appointmentDate || null,
      preferredTime: preferredTime || null,
      referralSource: referralSource || null,
      status: 'pending',
      createdAt: Date.now(),
    };
    
    const ref = await db.collection('bookings').add(booking);
    res.status(200).json({ id: ref.id });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export const adminUpdateBookingStatus = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { bookingId, status } = request.data;
  if (!bookingId || !status) throw new HttpsError('invalid-argument', 'Missing bookingId or status.');
  
  await db.collection('bookings').doc(bookingId).update({ status });
  return { success: true };
});

export const adminGetBookings = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const snap = await db.collection('bookings').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

export const adminDeleteBooking = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { bookingId } = request.data;
  if (!bookingId) throw new HttpsError('invalid-argument', 'Missing bookingId.');
  
  await db.collection('bookings').doc(bookingId).delete();
  return { success: true };
});

