/* VIONA v30: network-first CSS/JS, no stale seasonal skin or checkout cache. */
const CACHE="viona-reboot-v30";
const SHELL=[
 "/","/manifest.webmanifest?v=30","/favicon.svg?v=30",
 "/rich-details.css?v=1","/v14.css?v=1","/v15.css?v=1",
 "/v16.css?v=1","/telegram-login.css?v=2",
 "/product-detail-layout.css?v=4","/viona-checkout.css?v=3",
 "/viona-relaunch.css?v=17","/payment-result.css?v=17","/viona-reset.css?v=1",
 "/assets/viona-mark.webp?v=1","/assets/viona-user-logos.webp?v=23",
 "/assets/brand-mir.svg?v=23","/assets/brand-sberpay.svg?v=23",
 "/assets/brand-max.svg?v=23","/assets/brand-gamepad.svg?v=23",
 "/viona-icons.js?v=18","/v15.js?v=30","/rich-details.js?v=4",
 "/telegram-login.js?v=4","/v16.js?v=20","/payment-result.js?v=18",
 "/viona-reset-motion.js?v=1","/viona-original-assets.js?v=1"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).catch(()=>{}));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 const request=event.request;if(request.method!=="GET")return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 if(url.pathname.startsWith("/api/")||url.pathname.startsWith("/auth/")||url.pathname.startsWith("/payment/"))return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).catch(()=>caches.match("/")));
  return;
 }
 if(!/\.(css|js|png|webp|svg|webmanifest)$/i.test(url.pathname))return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(request,clone))}
  return response;
 }).catch(()=>caches.match(request)));
});
