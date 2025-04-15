const CACHE_NAME = 'plantmommy-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/test.html',
  '/anetka.html',
  '/twojastara.html'
  // Możesz dodać inne potrzebne pliki jak np. ikony
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
