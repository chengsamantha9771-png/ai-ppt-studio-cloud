const CACHE = 'ai-ppt-studio-v9-appgrade';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./','./index.html','./styles.css','./app.js','./pptxgen.bundle.js','./manifest.webmanifest','./icon.svg']))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
