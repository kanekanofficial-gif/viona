"use strict";
/* Apply local editor preferences to existing code-edit form without executing source. */
(()=>{
 const KEY="viona-editor-v1";
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}};
 const defaults={font:13,wrap:false,tabs:2,theme:"dark",numbers:true};
 let p={...defaults,...read()};
 const allowed={font:[12,13,14,16,18],tabs:[2,4,8],theme:["dark","light"]};
 function init(){
  const code=document.getElementById("codeSource");if(!code)return;
  const wrapper=document.createElement("div");wrapper.className="vst-editor-wrap";wrapper.id="vstLiveEditor";
  const gutter=document.createElement("pre");gutter.className="vst-line-nums";gutter.setAttribute("aria-hidden","true");
  code.parentElement.insertBefore(wrapper,code);wrapper.append(gutter,code);code.classList.add("vst-code");
  const controls=document.createElement("div");controls.className="vst-form-editor-controls";
  controls.innerHTML='<label>Шрифт <select data-code-pref="font">'+allowed.font.map(x=>'<option value="'+x+'">'+x+'px</option>').join("")+'</select></label>'+
   '<label>Отступ <select data-code-pref="tabs">'+allowed.tabs.map(x=>'<option value="'+x+'">'+x+' пробела</option>').join("")+'</select></label>'+
   '<label>Тема <select data-code-pref="theme"><option value="dark">Тёмная</option><option value="light">Светлая</option></select></label>'+
   '<label><input type="checkbox" data-code-pref="wrap"> Перенос</label>'+
   '<label><input type="checkbox" data-code-pref="numbers"> Номера строк</label>';
  wrapper.before(controls);
  const update=()=>{
   code.style.fontSize=p.font+"px";code.style.tabSize=p.tabs;code.style.lineHeight="1.7";code.style.whiteSpace=p.wrap?"pre-wrap":"pre";code.style.overflowWrap=p.wrap?"anywhere":"normal";
   code.classList.toggle("vst-editor-dark",p.theme==="dark");code.classList.toggle("vst-editor-light",p.theme==="light");
   gutter.style.fontSize=p.font+"px";gutter.hidden=!p.numbers;
   wrapper.style.gridTemplateColumns=p.numbers?"40px minmax(0,1fr)":"minmax(0,1fr)";
   gutter.textContent=Array.from({length:Math.min(code.value.split("\n").length,2000)},(_,i)=>i+1).join("\n");
   for(const input of controls.querySelectorAll("[data-code-pref]")){
    const value=p[input.dataset.codePref];if(input.type==="checkbox")input.checked=Boolean(value);else input.value=String(value);
   }
  };
  controls.addEventListener("change",e=>{
   const key=e.target.dataset.codePref;if(!key)return;
   let value=e.target.type==="checkbox"?e.target.checked:allowed[key]?.includes(Number(e.target.value))?Number(e.target.value):e.target.value;
   if(allowed[key]&&!allowed[key].includes(value))return;
   p[key]=value;try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}
   update();
  });
  code.addEventListener("input",update);
  code.addEventListener("scroll",()=>gutter.scrollTop=code.scrollTop,{passive:true});
  code.addEventListener("keydown",e=>{
   if(e.key!=="Tab")return;e.preventDefault();const txt=" ".repeat(p.tabs);
   code.setRangeText(txt,code.selectionStart,code.selectionEnd,"end");update();
  });
  update();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();