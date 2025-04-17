const CACHE_NAME = 'plantmommy-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/anetka.html',
  '/twojastara.html',
  '/icon.png'
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
function getUserIdFromURL() {
  if (self.location.href.includes('twojastara')) return 1;
  if (self.location.href.includes('anetka')) return 2;
  return null;
}

function checkTimeAndNotify() {
  const userId = getUserIdFromURL();
  if (!userId) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour === 17 || hour === 20) {
    fetch(`https://plantmommy.ct.ws/check-watering.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.notify && data.plants.length > 0) {
          const plantList = data.plants.join(', ');
          self.registration.showNotification("🌿 Rośliny do podlania!", {
            body: `Czas podlać: ${plantList}`,
            icon: '/icon.png',
            badge: '/icon.png'
          });
        }
      });
  }
}

// Sprawdzamy co godzinę
setInterval(checkTimeAndNotify, 60 * 60 * 1000);
