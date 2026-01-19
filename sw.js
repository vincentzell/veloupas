// J'ai changé v1 en v2 pour forcer la mise à jour
const CACHE_NAME = 'velotaf-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // ATTENTION : Vérifiez que ce fichier existe bien. 
  // Si vous utilisez maintenant icon-192.png, mettez le bon nom ici !
  './icon.png' 
];

// Installation
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // Force le nouveau SW à s'activer immédiatement
  self.skipWaiting();
});

// Activation (Nettoyage des vieux caches v1)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch (Network First pour le développement, c'est plus sûr)
// Cette stratégie tente d'abord Internet, et sinon le cache (hors ligne)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
