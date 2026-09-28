
const CACHE_NAME = 'sanex-cache-v1';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/globals.css',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser extensions and non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Skip Firebase Functions, Auth, Firestore and Google APIs to avoid CORS and stream breakage
  if (
    event.request.url.includes('cloudfunctions.net') || 
    event.request.url.includes('identitytoolkit') ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('firebaseio.com')
  ) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and no cache, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });

      // Stale-While-Revalidate: Return cache immediately if available, update in background
      return cachedResponse || fetchPromise;
    })
  );
});
