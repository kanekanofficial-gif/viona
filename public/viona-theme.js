"use strict";
/* User-selectable light/dark/system theme. Femboy locale always uses pink/black styling. */
(()=>{
 const root=document.documentElement;
 const KEY="viona-theme";
 const allowed=new Set(["auto","light","dark"]);
 const media=window.matchMedia("(prefers-color-scheme: dark)");
 const choice=()=>{try{const v=localStorage.getItem(KEY);return allowed.has(v)?v:"auto"}catch{return"auto"}};
 let mode=choice();
 const locale=()=>root.dataset.world||"ru";
 const labels={
  ru:{theme:"Тема",auto:"Как в системе",light:"Светлая",dark:"Тёмная"},
  en:{theme:"Theme",auto:"System",light:"Light",dark:"Dark"},
  ja:{theme:"テーマ",auto:"システムに合わせる",light:"ライト",dark:"ダーク"},
  de:{theme:"Design",auto:"System",light:"Hell",dark:"Dunkel"},
  femboy:{theme:"Темка ♡",auto:"Как в системе",light:"Светлая",dark:"Тёмная"}
 };
 function render(){
  const effective=mode==="auto"?(media.matches?"dark":"light"):mode;
  root.dataset.theme=effective;
  root.dataset.themeChoice=mode;
  root.style.colorScheme=locale()==="femboy"?"dark":effective;
  const select=document.querySelector("#vionaThemeMode");
  const label=document.querySelector("#vionaThemeLabel");
  const words=labels[locale()]||labels.ru;
  if(select){
   select.value=mode;select.setAttribute("aria-label",words.theme);
   for(const option of select.options)if(words[option.value])option.textContent=words[option.value];
  }
  if(label)label.textContent=words.theme;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=locale()==="femboy"?"#101014":effective==="dark"?"#111316":"#eef7f8";
 }
 function choose(value){
  if(!allowed.has(value))return;
  mode=value;
  try{localStorage.setItem(KEY,value)}catch{}
  render();
 }
 const init=()=>{
  const select=document.querySelector("#vionaThemeMode");
  if(select)select.addEventListener("change",e=>choose(e.target.value));
  render();
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
 if(media.addEventListener)media.addEventListener("change",()=>{if(mode==="auto")render()});
 else media.addListener?.(()=>{if(mode==="auto")render()});
 new MutationObserver(changes=>{if(changes.some(x=>x.attributeName==="data-world"))render()})
  .observe(root,{attributes:true,attributeFilter:["data-world"]});
 window.VionaTheme={choose,render,current:()=>mode};
})();