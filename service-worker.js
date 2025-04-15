const CACHE_NAME = 'plantmommy-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/test.html',
  '/anetka.html',
  '/twojastara.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// -----------------------------
// 🔔 Powiadomienia dwa razy dziennie
// -----------------------------
const userId = 1; // Twoja Stara — możesz to później zmieniać dynamicznie

function checkTimeAndNotify() {
  const now = new Date();
  const hour = now.getHours();

  // Sprawdza tylko o 17 lub 20
  if (hour === 17 || hour === 20) {
    fetch(`check-watering.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.notify && data.plants.length > 0) {
          const plantList = data.plants.join(', ');
          self.registration.showNotification("🌿 Rośliny do podlania!", {
            body: `Czas podlać: ${plantList}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      });
  }
}

// Co godzinę sprawdzamy godzinę
setInterval(checkTimeAndNotify, 60 * 60 * 1000); // co 1 godzinę
