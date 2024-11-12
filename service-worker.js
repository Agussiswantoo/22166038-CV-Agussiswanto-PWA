// Nama cache, bisa diganti saat versi baru rilis
const CACHE_NAME = 'portfolio-pwa-cache-v1';

// File yang akan dicache (disesuaikan dengan manifest.json)
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',  // Tambahkan file CSS sesuai kebutuhan
  '/script.js',   // Tambahkan file JavaScript sesuai kebutuhan
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-152x152.png',
  '/images/icon-192x192.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',
  '/images/screenshot-wide.png',
  '/images/screenshot-standard.png'
];

// Install event - caching file saat pertama kali service worker diinstall
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('Service Worker: Caching Files Failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - membersihkan cache lama jika ada
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - menggunakan cache jika ada, atau mengambil dari jaringan jika tidak ada di cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Service Worker: Returning Cached Response', event.request.url);
        return response;
      }
      console.log('Service Worker: Fetching from Network', event.request.url);
      return fetch(event.request).then(networkResponse => {
        // Simpan respons jaringan di cache jika file baru
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Fallback ke halaman default jika offline
      if (event.request.url.endsWith('.html')) {
        return caches.match('/index.html');
      }
    })
  );
});
