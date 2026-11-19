"use strict";
/* VIONA 2.0 creative illustrations and respectful first-visit careers notice. */
(()=>{
 const scenes={
  1:{colors:["#142e46","#317a8c"],draw:'<rect x="100" y="32" width="385" height="250" rx="25" fill="#131d2d" stroke="#8fdbea" stroke-width="3"/><rect x="129" y="58" width="324" height="185" rx="11" fill="#26465e"/><circle cx="181" cy="113" r="33" fill="#72d9e5"/><path d="m160 111 43-15-11 39-12-12-11 8 2-15Z" fill="#142d46"/><rect x="236" y="92" width="169" height="14" rx="7" fill="#d6fff1"/><rect x="236" y="121" width="124" height="9" rx="4" fill="#83abbe"/><rect x="155" y="166" width="221" height="39" rx="12" fill="#a0d6c5"/><rect x="188" y="259" width="210" height="5" rx="2" fill="#a0d6c5"/>'},
  2:{colors:["#403b64","#9d6789"],draw:'<rect x="85" y="42" width="430" height="248" rx="17" fill="#eee7eb"/><rect x="85" y="42" width="430" height="41" rx="17" fill="#b5acc7"/><circle cx="114" cy="64" r="7" fill="#db7b73"/><circle cx="134" cy="64" r="7" fill="#f5d59b"/><rect x="107" y="105" width="176" height="160" rx="11" fill="#a78abc"/><circle cx="193" cy="153" r="37" fill="#4b4265"/><path d="M120 242q12-72 70-72t82 72" fill="#5e577e"/><rect x="308" y="112" width="166" height="17" rx="5" fill="#665b80"/><rect x="308" y="147" width="146" height="9" rx="3" fill="#9c92a5"/><rect x="308" y="165" width="163" height="9" rx="3" fill="#b2a6b7"/><rect x="308" y="205" width="106" height="36" rx="8" fill="#e78b8a"/>'},
  3:{colors:["#292858","#5957ba"],draw:'<rect x="80" y="35" width="440" height="258" rx="25" fill="#12132b"/><rect x="80" y="35" width="80" height="258" rx="21" fill="#292c56"/><circle cx="119" cy="87" r="20" fill="#afa8fe"/><rect x="181" y="70" width="302" height="35" rx="8" fill="#525ba4"/><rect x="181" y="122" width="202" height="39" rx="12" fill="#292b58"/><rect x="219" y="131" width="146" height="11" rx="5" fill="#d8dbff"/><rect x="278" y="177" width="193" height="54" rx="12" fill="#6876cf"/><path d="M306 203l15 10 22-23" fill="none" stroke="#e8e8ff" stroke-width="6" stroke-linecap="round"/><circle cx="213" cy="248" r="13" fill="#a49ce6"/><rect x="234" y="244" width="174" height="9" rx="4" fill="#979cd3"/>'},
  4:{colors:["#20384c","#57747e"],draw:'<path d="m297 22 135 73v130l-135 75-136-75V95z" fill="#1a2d36" stroke="#b6e2db" stroke-width="3"/><path d="m161 95 136 76 135-76M297 171v129" fill="none" stroke="#94c6bc" stroke-width="3"/><path d="m297 78 88 47-88 47-87-47z" fill="#b6dadd"/><path d="m213 135 83 47v91l-83-46z" fill="#6597a1"/><path d="m297 181 83-46v92l-83 47z" fill="#93beba"/><circle cx="445" cy="76" r="28" fill="#d8a070"/><rect x="106" y="204" width="65" height="65" rx="14" fill="#8bd4c6"/>'},
  5:{colors:["#24514a","#91a47e"],draw:'<rect x="73" y="30" width="456" height="270" rx="19" fill="#f0eddc"/><rect x="73" y="30" width="456" height="40" rx="19" fill="#a6c9ac"/><circle cx="100" cy="52" r="6" fill="#ec9a83"/><circle cx="120" cy="52" r="6" fill="#f3e0a4"/><path d="M109 97h160v22H109z" fill="#2e5345"/><path d="M109 135h211v9H109zM109 154h173v9H109z" fill="#9daea1"/><rect x="109" y="198" width="139" height="46" rx="8" fill="#edb26f"/><rect x="341" y="97" width="151" height="147" rx="10" fill="#e7a1a8"/><circle cx="416" cy="159" r="43" fill="#d7eddb"/><path d="m370 218 47-48 38 38" fill="none" stroke="#5a8a79" stroke-width="7"/>'},
  6:{colors:["#172e27","#536c48"],draw:'<rect x="79" y="32" width="440" height="257" rx="19" fill="#101b1a" stroke="#c1fc7a" stroke-width="3"/><rect x="79" y="32" width="440" height="45" rx="19" fill="#2c4634"/><circle cx="113" cy="55" r="7" fill="#e8a49b"/><circle cx="134" cy="55" r="7" fill="#eace85"/><circle cx="155" cy="55" r="7" fill="#b5ecae"/><text x="110" y="117" fill="#d7ffa2" font-family="monospace" font-size="24">&lt;script&gt;</text><path d="M116 145h119M116 166h264M116 189h204M116 212h266M116 238h115" fill="none" stroke="#7bc6ab" stroke-width="9" stroke-linecap="round"/><path d="M262 145h109M356 189h85" stroke="#f1d19d" stroke-width="9" stroke-linecap="round"/><text x="396" y="269" fill="#bcf38f" font-family="monospace" font-size="16">v20/</text>'},
  7:{colors:["#253767","#5084b4"],draw:'<rect x="95" y="31" width="410" height="251" rx="40" fill="#dceaff"/><path d="M140 84q0-35 35-35h250q40 0 40 35v107q0 40-40 40H250l-64 39v-39h-11q-35 0-35-40Z" fill="#5586d3"/><path d="M198 112h180M198 147h133" stroke="#eaf3ff" stroke-width="17" stroke-linecap="round"/><circle cx="386" cy="183" r="23" fill="#b0ddff"/><path d="m377 183 9 9 12-18" fill="none" stroke="#22569a" stroke-width="5" stroke-linecap="round"/>'},
  8:{colors:["#4b2633","#a74b66"],draw:'<circle cx="298" cy="157" r="115" fill="#0f0e16" stroke="#f8d09c" stroke-width="4"/><circle cx="298" cy="157" r="85" fill="#b65877"/><circle cx="298" cy="157" r="39" fill="#f5deb4"/><circle cx="298" cy="157" r="15" fill="#1d2024"/><path d="M30 165q58-80 109 0t95 0t95 0t100 0t140 0" fill="none" stroke="#f6ca9d" stroke-width="6" stroke-linecap="round"/><path d="M40 232h74M470 232h75" stroke="#f7d5c4" stroke-width="3" stroke-linecap="round"/><text x="37" y="54" fill="#ffe5c8" font-family="monospace" font-size="16">SOUNDLAB / 001</text><text x="375" y="281" fill="#ffe5c8" font-family="monospace" font-size="15">KANEKAN KAN</text>'}
 };
 function artwork(id){
  const item=scenes[id]||scenes[6];const a=item.colors[0],b=item.colors[1];
  return '<svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="v20Gradient'+id+'" x1="0" x2="1" y1="0" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="600" height="320" fill="url(#v20Gradient'+id+')"/><circle cx="530" cy="35" r="115" fill="#ffffff" opacity=".06"/><circle cx="35" cy="302" r="75" fill="#ffffff" opacity=".07"/>'+item.draw+'</svg>';
 }
 function decorate(){
  const grid=document.getElementById("products");if(!grid)return;
  for(const card of grid.querySelectorAll(".product:not([data-v20-decorated])")){
   const id=Number(card.querySelector("[data-view]")?.dataset.view||0);
   card.dataset.v20Decorated="1";card.dataset.v20ProductId=String(id);
   const art=document.createElement("div");art.className="v20-product-art";art.setAttribute("aria-hidden","true");
   art.innerHTML=artwork(id);
   card.querySelector(".product-head")?.insertAdjacentElement("afterend",art);
   if(id===8){
    const view=card.querySelector("[data-view]");
    const cart=card.querySelector('[data-action="cart"]');
    view?.remove();cart?.remove();
    const heading=card.querySelector("h3");
    if(heading){
     const sub=document.createElement("p");sub.className="v20-music-artist";sub.textContent="АРТИСТ: KANEKAN KAN / SOUNDLAB";
     heading.insertAdjacentElement("afterend",sub);
    }
    const link=document.createElement("a");link.className="v20-music-cta";link.href="/soundlab";link.textContent="Создать музыкальную заявку ↗";
    const bio=document.createElement("a");bio.className="v20-music-bio";bio.href="/KANEKANKANARTIST";bio.textContent="Биография артиста ↗";
    card.querySelector(".product-foot")?.before(link,bio);
   }
  }
 }
 const grid=document.getElementById("products");
 if(grid){new MutationObserver(decorate).observe(grid,{childList:true});decorate()}
 const prompt=document.getElementById("v20HiringPrompt");
 const close=document.getElementById("v20HiringClose");
 if(prompt&&close){
  const key="viona20-hiring-dismissed";
  const dismissed=()=>{try{return localStorage.getItem(key)==="1"}catch{return false}};
  if(!dismissed())prompt.hidden=false;
  const dismiss=()=>{prompt.hidden=true;try{localStorage.setItem(key,"1")}catch{}};
  close.addEventListener("click",dismiss);
  prompt.querySelector("a[href='/careers']")?.addEventListener("click",dismiss);
 }
})();
