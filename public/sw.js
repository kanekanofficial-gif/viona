/* VIONA Liquid Glass shell. API, authentication and payment responses are never cached. */
const CACHE="viona-shell-v23-1";
const SHELL=[
 "/","/favicon.svg?v=1","/manifest.webmanifest?v=23",
 "/rich-details.css?v=1","/v14.css?v=1","/v15.css?v=1","/v16.css?v=1","/product-detail-layout.css?v=4","/telegram-login.css?v=2",
 "/viona-checkout.css?v=3","/viona-relaunch.css?v=17","/payment-result.css?v=17","/viona-liquid-glass.css?v=1",
 "/assets/viona-mark.webp?v=1","/assets/viona-user-logos.webp?v=23",
 "/assets/brand-mir.svg?v=23","/assets/brand-sberpay.svg?v=23","/assets/brand-max.svg?v=23","/assets/brand-gamepad.svg?v=23",
 "/viona-icons.js?v=18","/v15.js?v=19","/rich-details.js?v=4","/telegram-login.js?v=4","/v16.js?v=20","/payment-result.js?v=18","/viona-motion.js?v=1"
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
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.startsWith("/api/")||url.pathname.startsWith("/auth/")||url.searchParams.has("auth"))return;
 if(url.pathname.startsWith("/payment/")){event.respondWith(fetch(request));return}
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).catch(()=>caches.match("/")));
  return;
 }
 if(!/\.(?:css|js|png|webp|svg|webmanifest)$/.test(url.pathname))return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(request,clone))}
  return response;
 }).catch(()=>caches.match(request)));
});
