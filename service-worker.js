const CACHE_NAME = 'plantmommy-cache-v5';
const urlsToCache = [
  '/Plantmommy-frontend/',
  '/Plantmommy-frontend/index.html',
  '/Plantmommy-frontend/anetka.html',
  '/Plantmommy-frontend/twojastara.html',
  '/Plantmommy-frontend/icon.png'
];

// Instalacja Service Workera i cache
self.addEventListener('install', event => {
  self.skipWaiting(); // natychmiastowa aktywacja
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Aktywacja i przejęcie kontroli nad stronami
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Obsługa fetch (pobieranie z cache lub sieci)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Push API - Obsługa powiadomień push
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "🌿 Powiadomienie od PlantMommy!";
  const options = {
    body: data.body || "Czas podlać swoje rośliny!",
    icon: '/Plantmommy-frontend/icon.png',
    badge: '/Plantmommy-frontend/icon.png',
    data: {
      url: data.url || '/Plantmommy-frontend/index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Kliknięcie w powiadomienie
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/Plantmommy-frontend/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
