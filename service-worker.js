const CACHE_NAME = 'plantmommy-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/anetka.html',
  '/twojastara.html',
  '/icon.png'
];

// -----------------------------
// Instalacja Service Workera i cache
// -----------------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// -----------------------------
// Obsługa fetch (pobieranie z cache lub sieci)
// -----------------------------
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// -----------------------------
// Push API - Obsługa powiadomień push
// -----------------------------
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json(); // Dane przesyłane przez serwer
  }

  const title = data.title || "🌿 Powiadomienie od PlantMommy!";
  const options = {
    body: data.body || "Czas podlać swoje rośliny!",
    icon: '/icon.png',
    badge: '/icon.png',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// -----------------------------
// Kliknięcie w powiadomienie
// -----------------------------
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Zamknij powiadomienie

  // Otwórz stronę lub przenieś użytkownika do odpowiedniego linku
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});
