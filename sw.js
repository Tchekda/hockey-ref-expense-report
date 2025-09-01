// Service Worker for PWA functionality
const CACHE_NAME = 'ndf-arbitre-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/storage.js',
    '/js/pdf-generator.js',
    '/js/form-handler.js',
    '/img/arbitre.png',
    '/manifest.json',
    // External dependencies
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                // Force activation of new service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            // Take control of all pages immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }

                // Otherwise fetch from network
                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request).then((response) => {
                    // Don't cache if not a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Add to cache for future use
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch((error) => {
                console.error('Service Worker: Fetch failed', error);
                // You could return a fallback page here
                throw error;
            })
    );
});

// Handle background sync (for future enhancements)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync');
        // Could sync data when connection is restored
    }
});

// Handle push notifications (for future enhancements)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        console.log('Service Worker: Push received', data);

        const options = {
            body: data.body,
            icon: '/img/arbitre.png',
            badge: '/img/arbitre.png',
            data: data.data || {}
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});
