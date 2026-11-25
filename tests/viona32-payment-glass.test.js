"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const {trustedPaymentUrl}=require("../tbank-demo");
test("T-Bank accepts only bank-owned HTTPS hosted payment pages, including DEMO domains",()=>{
 const good=[
  "https://securepay.tinkoff.ru/new/a8c7",
  "https://securepayments.tinkoff.ru/pay/abc",
  "https://rest-api-test.tinkoff.ru/new/XYZ",
  "https://pay.tbank-online.com/payment/example",
  "https://securepay.tbank.ru/new/xyz"
 ];
 for(const url of good)assert.equal(trustedPaymentUrl(url),true,url);
 const bad=[
  "https://securepay.tinkoff.ru.evil.example/new/x",
  "https://evil.example/?url=securepay.tinkoff.ru",
  "http://securepay.tinkoff.ru/new/a",
  "https://user:pass@securepay.tinkoff.ru/new/a",
  "https://securepay.tinkoff.ru:444/new/a",
  "javascript:alert(1)",
  "https://tinkoff.ru.evil.example/new/a",
  "https://example.tinkoff.ru/new/x",
  "https://pay.tbank-online.com.evil.example",
  "https://some-random-bank.example/new"
 ];
 for(const url of bad)assert.equal(trustedPaymentUrl(url),false,url);
});
test("Front-end verifies exactly matching bank hosts",()=>{
 const client=read("public/atelier/app.js");
 assert.match(client,/securepayments\.tinkoff\.ru/);
 assert.match(client,/rest-api-test\.tinkoff\.ru/);
 assert.match(client,/new Set\(\["securepay\.tinkoff\.ru"/);
});
test("All three customer supplied illustrations are used on the actual catalog",()=>{
 const app=read("public/atelier/app.js"),cat=read("public/atelier/catalog.js");
 for(const svg of ["portfolio-ui.svg","landing-windows.svg","code-editor.svg"]){
  assert.match(read("public/assets/catalog/"+svg),/<svg/i);
  assert.ok(app.includes(svg)&&cat.includes(svg),svg);
 }
});
test("Glass uses a real animated SVG backdrop displacement and fallback, with readable foreground",()=>{
 const css=read("public/atelier/glass-v32.css"),js=read("public/atelier/glass-v32.js");
 for(const t of ["feTurbulence","feGaussianBlur","feDisplacementMap","viona-glass-ripple","baseFrequency"])assert.ok(js.includes(t),t);
 assert.match(css,/backdrop-filter:url\("#viona-glass-ripple"\)/);
 assert.match(css,/\.glass\.has-refraction>:not\(\.glass-refraction\)/);
 assert.match(css,/blur\(3px\) saturate\(125%\)/);
 assert.match(css,/prefers-reduced-motion/);
});
test("Light theme modal contrast is explicitly defined",()=>{
 const css=read("public/atelier/glass-v32.css");
 assert.match(css,/:root\[data-theme=light\]:not\(\[data-style=pink\]\).*\.dialog/);
 assert.match(css,/\.dialog h2,\.dialog h3/);
 assert.match(css,/--dialog-bg:rgba\(239,247,251,.96\)/);
 assert.match(css,/\.dialog \.product-full-header h2\{color:var\(--text\)/);
});
test("Real femboy and gothic modes change wording, not colors alone",()=>{
 const lang=read("public/atelier/language.js"),voices=read("public/atelier/special-voices.js"),theme=read("public/atelier/glass-v32.css");
 assert.match(lang,/pink","goth/);
 assert.match(lang,/location\.reload\(\)/);
 assert.match(lang,/В корзиночку/);
 assert.match(lang,/Открыть досье/);
 assert.match(theme,/:root\[data-style=goth\]/);
 assert.match(voices,/Звук/);
 assert.match(voices,/Твоя идея/);
});
test("Language and light-dark theme persist and reload across pages",()=>{
 for(const page of ["public/index.html","public/v2/music.html","public/v2/artist.html","public/v2/catalog.html","public/v2/careers.html"]){
  assert.match(read(page),/\/atelier\/glass-v32\.css/);
  assert.match(read(page),/\/atelier\/theme-global\.js/);
  assert.match(read(page),/\/atelier\/special-voices\.js/);
 }
 assert.match(read("public/atelier/theme-global.js"),/location\.reload/);
 assert.match(read("public/atelier/app.js"),/location\.reload/);
});
