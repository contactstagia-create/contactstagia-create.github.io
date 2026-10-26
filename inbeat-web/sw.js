// Service worker d'InBeat (version web). Généré par build-web.cjs à partir de ce modèle : inbeat-web-0.5.76-9fa99646 est remplacé par le nom de cache versionné.
const CACHE = 'inbeat-web-0.5.76-9fa99646';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); });
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('inbeat-web-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Pas de skipWaiting automatique : la page demande la mise à jour (et jamais pendant la lecture).
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // mesure, bandeau, etc. : jamais interceptés
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then((hit) =>
      hit || fetch(r).catch(() => (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    )
  );
});
