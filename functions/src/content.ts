
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

export const adminSeedInitialData = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);

  const batch = db.batch();

  // General Settings
  batch.set(db.collection('settings').doc('general'), {
    siteName: "SANEX Company Ltd",
    logoUrl: "https://picsum.photos/seed/sanexlogo/200/200",
    logoWidth: 160,
    logoHeight: 40,
    phone: "+250 788 303 628",
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
    category: category || 'General',
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

export const adminAddGalleryItem = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { imageUrl, description, width, height } = request.data;
  if (!imageUrl || !description) throw new HttpsError('invalid-argument', 'Missing fields.');
  
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

export const createBooking = onCall({ cors: true }, async (request: CallableRequest) => {
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

export const adminUpdateBookingStatus = onCall({ cors: true }, async (request: CallableRequest) => {
  await assertAdmin(request);
  const { bookingId, status } = request.data;
  if (!bookingId || !status) throw new HttpsError('invalid-argument', 'Missing bookingId or status.');
  
  await db.collection('bookings').doc(bookingId).update({ status });
  return { success: true };
});
