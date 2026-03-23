const CACHE_NAME = 'fellowship-faceoff-v10';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './mode-sing.png', './mode-act.png', './mode-explain.png', './mode-champ.png', './mode-library.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then(r => { if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, c)); } return r; }).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(c => c || fetch(event.request).then(r => { if (r && r.status === 200) { const cl = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, cl)); } return r; })).catch(() => caches.match('./index.html'))
    );
  }
});
