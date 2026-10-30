"use strict";
/* Original, deterministic SVG artwork for VIONA catalog cards. No external assets. */
(function(){
 const svg=(kind,aria,body)=>'<svg class="viona-catalog-svg viona-icon-'+kind+'" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+aria+'" focusable="false">'+body+'</svg>';
 const assets={
  telegram:svg("telegram","Telegram",
   '<circle cx="36" cy="36" r="29" fill="#209bd7"/><circle cx="36" cy="36" r="29" fill="none" stroke="#9cddfa" stroke-opacity=".6" stroke-width="1.4"/><path d="M17 35.2 54.9 20.9c2.2-.7 3.6.5 3 2.9L51.5 54c-.4 1.8-2 2.3-3.6 1.4L37.1 47l-5.5 5c-.8.8-1.7 1.2-2.8 1.2l1.2-13.4 22.8-15.3-27.1 12.8-8-2.6c-2-.7-2.1-2.5-.7-3.5Z" fill="#fff"/><path d="m30 39.8 22.8-15.3L35.2 43.6l1.9 3.4-5.5 5Z" fill="#cceffd"/>'),
  discord:svg("discord","Discord",
   '<rect x="5" y="7" width="62" height="58" rx="20" fill="#5865f2"/><path d="M48.4 20.8c-3.5-1.7-5.8-1.9-5.8-1.9l-.9 1.9a36 36 0 0 0-11.4 0l-1-1.9s-2.4.2-5.8 1.9c-4 6-5.3 11.9-4.9 17.7 4.3 3.3 8.3 4.5 8.3 4.5l1.8-2.9-2.6-1.3 1.1-.7c5.5 2.6 11.8 2.6 17.6 0l1.1.7-2.6 1.3 1.8 2.9s4-1.2 8.3-4.5c.6-6.3-1-12.1-5-17.7Z" fill="#fff"/><ellipse cx="30.2" cy="33.7" rx="3" ry="3.8" fill="#5865f2"/><ellipse cx="41.8" cy="33.7" rx="3" ry="3.8" fill="#5865f2"/>'),
  portfolio:svg("portfolio","UI и дизайн",
   '<rect x="7" y="11" width="58" height="50" rx="9" fill="#26374f" stroke="#b2d0ec" stroke-width="1.6"/><path d="M8 23h56" stroke="#a8c4ec" stroke-width="1.5"/><circle cx="15" cy="17" r="2" fill="#fb9e83"/><circle cx="22" cy="17" r="2" fill="#f4d383"/><circle cx="29" cy="17" r="2" fill="#9bdfbf"/><rect x="14" y="30" width="20" height="22" rx="4" fill="#7ea2e1"/><path d="m19 43 5-6 4 4 2-2 3 4" stroke="#d8e8ff" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M41 33h17M41 40h14M41 47h11" stroke="#e1eaff" stroke-width="3" stroke-linecap="round"/>'),
  game:svg("game","Игровые инструменты",
   '<rect x="8" y="13" width="56" height="46" rx="16" fill="#46385f"/><path d="M18 24c3-5 9-6 18-6s15 1 18 6l8 20c2 6-4 12-9 9l-11-9H30l-11 9c-5 3-11-3-9-9l8-20Z" fill="#d7b2ff"/><path d="M23 31v14m-7-7h14" stroke="#42315b" stroke-width="4" stroke-linecap="round"/><circle cx="47" cy="33" r="3.3" fill="#7f5ca4"/><circle cx="54" cy="40" r="3.3" fill="#f4a9ae"/><path d="M33 45h6" stroke="#59436f" stroke-width="2.2" stroke-linecap="round"/>'),
  landing:svg("landing","Веб-страницы и шаблоны",
   '<rect x="8" y="10" width="56" height="53" rx="8" fill="#253e43" stroke="#88dbcc" stroke-width="1.7"/><path d="M9 23h54" stroke="#80c8b9" stroke-width="1.5"/><circle cx="16" cy="16.5" r="2" fill="#d7acb6"/><circle cx="23" cy="16.5" r="2" fill="#efe0b6"/><rect x="15" y="30" width="24" height="5" rx="2.5" fill="#f3ebdf"/><rect x="15" y="40" width="20" height="3" rx="1.5" fill="#91bfb9"/><rect x="15" y="47" width="15" height="8" rx="3" fill="#a7dfd3"/><rect x="43" y="30" width="14" height="25" rx="4" fill="#4a9d9c"/><circle cx="50" cy="39" r="5" fill="#b3e7d5"/>'),
  code:svg("code","Разработка",
   '<rect x="8" y="9" width="56" height="54" rx="11" fill="#26334a" stroke="#a5bbe1" stroke-width="1.6"/><path d="M9 22h54" stroke="#b9cbed" stroke-width="1.3"/><circle cx="17" cy="16" r="2" fill="#f69d90"/><circle cx="24" cy="16" r="2" fill="#f4d18b"/><path d="m28 34-9 8 9 8m16-16 9 8-9 8m-6-21-6 26" stroke="#aee1ee" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  max:svg("max","MAX бот",
   '<rect x="8" y="10" width="56" height="50" rx="19" fill="#4661b4"/><path d="M19 30c0-6 5-10 12-10h12c7 0 12 4 12 10v8c0 6-5 10-12 10h-8l-9 7v-8c-4-2-7-5-7-9v-8Z" fill="#d9e4ff"/><path d="M26 34h22" stroke="#4269b6" stroke-width="3.5" stroke-linecap="round"/><path d="M26 41h14" stroke="#8098ce" stroke-width="3" stroke-linecap="round"/>'),
  bot:svg("bot","Бот и автоматизация",
   '<rect x="13" y="18" width="46" height="40" rx="12" fill="#8bc9c6"/><path d="M36 18v-7" stroke="#e9faf7" stroke-width="4" stroke-linecap="round"/><circle cx="36" cy="10" r="4" fill="#e9faf7"/><circle cx="26" cy="35" r="5" fill="#223b4c"/><circle cx="46" cy="35" r="5" fill="#223b4c"/><path d="M27 47c5 5 13 5 18 0" stroke="#223b4c" stroke-width="3" fill="none" stroke-linecap="round"/>')
 };
 function productIcon(item){
  const id=Number(item?.id);
  const byId={1:"telegram",2:"portfolio",3:"discord",4:"game",5:"landing",6:"code",7:"max"};
  let kind=byId[id];
  if(!kind){
   const t=String(item?.title||"").toLowerCase();
   kind=t.includes("telegram")?"telegram":t.includes("discord")?"discord":t.includes("max ")?"max":
     String(item?.category||"").includes("Игры")?"game":String(item?.category||"").includes("Боты")?"bot":
     String(item?.category||"").includes("Услуги")?"code":"portfolio";
  }
  return assets[kind]||assets.portfolio;
 }
 window.VionaIcons=Object.freeze({product:productIcon,kind:name=>assets[name]||assets.portfolio});
})();