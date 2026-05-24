const CACHE='ai-ppt-studio-cloud-v14-20260524';
const CORE_PATHS=['/','/index.html','/app.js','/styles.css','/sw.js','/templates/external_templates.json','/templates/registry.json'];

self.addEventListener('install',event=>{
 self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 const isCore=CORE_PATHS.includes(url.pathname);
 if(isCore){
  event.respondWith(
   fetch(event.request,{cache:'no-store'})
    .then(response=>{
     const copy=response.clone();
     caches.open(CACHE).then(cache=>cache.put(event.request,copy));
     return response;
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }
 event.respondWith(
  caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
   const copy=response.clone();
   caches.open(CACHE).then(cache=>cache.put(event.request,copy));
   return response;
  }))
 );
});
