
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

export const adminSeedInitialData = onCall(async (request: CallableRequest) => {
  await assertAdmin(request);

  const batch = db.batch();

  // General Settings
  batch.set(db.collection('settings').doc('general'), {
    siteName: "SANEX Company Ltd",
    logoUrl: "https://picsum.photos/seed/sanexlogo/200/200",
    phone: "+250 788 303 628",
    email: "info@sanex.rw"
  });

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
