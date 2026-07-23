/* Warehouse Command Center service worker.
 * App-shell caching + offline fallback. Data mutations are NOT cached here; the
 * receiving/request draft queue lives in the app (IndexedDB/localStorage) and syncs
 * idempotently when connectivity returns. Keep this file dependency-free. */

const CACHE = 'wcc-shell-v1';
const SHELL = ['/', '/dashboard', '/manifest.webmanifest', '/icons/icon.svg', '/offline'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Never cache API/auth/mutation traffic.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) return;

  // Network-first for navigations, falling back to cached shell / offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/offline')) || Response.error()),
    );
    return;
  }

  // Cache-first for static assets.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request)),
  );
});
