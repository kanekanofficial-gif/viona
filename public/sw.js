/* VIONA 17 — fresh visual shell. Payment/API/session responses never cached. */
const CACHE="viona-shell-v19-1";
const SHELL=[
 "/","/favicon.png",
 "/v14.css?v=1","/v15.css?v=1","/v16.css?v=1",
 "/viona-checkout.css?v=3","/viona-relaunch.css?v=17","/payment-result.css?v=17","/viona-halloween.css?v=19","/assets/viona-user-logos.webp?v=18",
 "/viona-icons.js?v=18","/v15.js?v=18","/v16.js?v=19","/payment-result.js?v=17","/viona-halloween.js?v=18"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).catch(()=>{}));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 const r=event.request;
 if(r.method!=="GET")return;
 const url=new URL(r.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.startsWith("/api/")||url.pathname.startsWith("/auth/")||url.searchParams.has("auth"))return;
 // Never serve the homepage as a fallback for a payment verification or order receipt.
 if(url.pathname.startsWith("/payment/")){event.respondWith(fetch(r));return}
 if(r.mode==="navigate"){
  event.respondWith(fetch(r).catch(()=>caches.match("/")));
  return;
 }
 if(!/\.(?:css|js|png|webp|svg|webmanifest)$/.test(url.pathname))return;
 event.respondWith(fetch(r).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put(r,clone))}
  return response;
 }).catch(()=>caches.match(r)));
});
