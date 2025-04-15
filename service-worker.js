const CACHE_NAME = 'plantmommy-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/test.html',
  '/anetka.html',
  '/twojastara.html',
  '/style.css',
  '/app.js',
  '/favicon.ico'
];

// Instalacja i cache'owanie plików
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Odpowiadanie z cache lub z sieci
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

// Obsługa powiadomień push (opcjonalnie z backendu)
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Czas podlać roślinę!';
  const options = {
    body: data.body || 'Twoje roślinki czekają na wodę 🌿💧',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 🕒 Sprawdzenie co 12h (lub częściej) czy trzeba podlać rośliny
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-watering') {
    event.waitUntil(checkWateringReminders());
  }
});

async function checkWateringReminders() {
  try {
    const response = await fetch('/check-watering.php?user_id=1'); // Zakładamy Twoja Stara
    const plants = await response.json();

    if (plants.length > 0) {
      const names = plants.map(p => p.name).join(', ');
      self.registration.showNotification('💧 Podlewanie potrzebne!', {
        body: `Rośliny do podlania: ${names}`,
        icon: '/favicon.ico'
      });
    }
  } catch (error) {
    console.error('Błąd sprawdzania podlewania:', error);
  }
}
