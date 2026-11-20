/* VIONA v30: network-first CSS/JS, no stale seasonal skin or checkout cache. */
const CACHE="viona-reboot-v41";
const SHELL=[
 "/atelier/main.css?v=2","/atelier/polish.css?v=1","/atelier/language.css?v=1","/atelier/language.js?v=1","/atelier/product-details.js?v=1","/atelier/app.js?v=2","/atelier/artist.css?v=1",
 "/atelier/music.css?v=1","/atelier/catalog.css?v=1","/atelier/catalog.js?v=1",
 "/atelier/secondary.css?v=1","/atelier/forms.js?v=2",
 "/classic.html","/v2/music.html","/v2/artist.html","/v2/catalog.html",
 "/assets/brand-icons/telegram.svg","/assets/brand-icons/discrod.svg",
 "/assets/brand-icons/Max.svg","/assets/brand-icons/t-pay-full.svg",
 "/assets/brand-icons/visa.svg","/assets/brand-icons/Mir.svg","/assets/brand-icons/sbp.svg",
 "/assets/brand-icons/sberpay.svg",
 "/","/manifest.webmanifest?v=30","/favicon.svg?v=30",
 "/rich-details.css?v=1","/v14.css?v=1","/v15.css?v=1",
 "/v16.css?v=1","/telegram-login.css?v=2",
 "/product-detail-layout.css?v=4","/viona-checkout.css?v=4",
 "/viona-relaunch.css?v=17","/payment-result.css?v=19","/viona-reset.css?v=1",
 "/viona-theme.css?v=1","/viona-requirements.css?v=1","/viona-settings.css?v=1","/code-edit.css?v=1",
 "/viona-telegram-builder.css?v=1","/viona-glass27.css?v=1","/viona-studio.css?v=1","/viona-studio-polish.css?v=1","/payment-result-theme.css?v=1","/viona-editor-prefs.css?v=1",
 "/assets/viona-mark.webp?v=1","/assets/viona-user-logos.webp?v=23",
 "/assets/brand-mir.svg?v=23","/assets/brand-sberpay.svg?v=23",
 "/assets/brand-max.svg?v=23","/assets/brand-gamepad.svg?v=23","/assets/flag-ru.svg","/assets/studio-icons.svg",
 "/viona2-home.css?v=1","/viona2-main.js?v=1","/v2/base.css?v=1","/v2/app.js?v=1",
 "/viona-theme.js?v=1","/viona-icons.js?v=18","/v15.js?v=33","/rich-details.js?v=4",
 "/viona-checkout-i18n.js?v=1","/viona-requirements.js?v=1","/viona-settings.js?v=1","/code-edit.js?v=1",
 "/viona-telegram-builder.js?v=1","/viona-studio.js?v=2","/viona-command.js?v=1","/viona-glass27.js?v=1","/viona-editor-prefs.js?v=1",
 "/telegram-login.js?v=4","/v16.js?v=22","/payment-result.js?v=20",
 "/viona-reset-motion.js?v=1","/viona-original-assets.js?v=1","/code-edit.html","/studio.html"
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
 if(url.pathname.startsWith("/admin-console"))return;
  if(!/\.(css|js|png|webp|svg|webmanifest)$/i.test(url.pathname))return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(request,clone))}
  return response;
 }).catch(()=>caches.match(request)));
});
