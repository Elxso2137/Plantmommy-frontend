const CACHE_NAME = 'plantmommy-cache-v6'; // Zaktualizowana wersja cache
const urlsToCache = [
  'https://elxso2137.github.io/Plantmommy-frontend/', // Pełne URL
  'https://elxso2137.github.io/Plantmommy-frontend/index.html',
  'https://elxso2137.github.io/Plantmommy-frontend/anetka.html',
  'https://elxso2137.github.io/Plantmommy-frontend/twojastara.html',
  'https://elxso2137.github.io/Plantmommy-frontend/icon.png'
];

// Instalacja Service Workera i cache
self.addEventListener('install', event => {
  self.skipWaiting(); // natychmiastowa aktywacja
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache)) // Zaktualizowane pełne URL-e
  );
});

// Aktywacja i usuwanie starych cache'y
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Tylko ten cache będzie utrzymany

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Usunięcie starych cache'y
          }
        })
      );
    }).then(() => {
      clients.claim(); // Natychmiastowe przejęcie kontroli
    })
  );
});

// Obsługa fetch (pobieranie z cache lub sieci)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request); // Jeśli nie ma w cache, pobierz z sieci
    })
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
    icon: 'https://elxso2137.github.io/Plantmommy-frontend/icon.png', // Zaktualizowany pełny URL
    badge: 'https://elxso2137.github.io/Plantmommy-frontend/icon.png', // Zaktualizowany pełny URL
    data: {
      url: data.url || 'https://elxso2137.github.io/Plantmommy-frontend/index.html' // Zaktualizowany pełny URL
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Kliknięcie w powiadomienie
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || 'https://elxso2137.github.io/Plantmommy-frontend/index.html'; // Zaktualizowany pełny URL

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
