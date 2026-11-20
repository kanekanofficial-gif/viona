"use strict";
(()=>{
 const music=document.getElementById("v2MusicForm"),careers=document.getElementById("v2CareersForm");
 const submit=async(path,form,status,button)=>{
  const data=Object.fromEntries(new FormData(form));
  button.disabled=true;status.textContent="Сохраняем заявку…";
  try{
   const res=await fetch(path,{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
   const body=await res.json().catch(()=>({}));
   if(!res.ok)throw Error(body.error||"Не удалось отправить заявку.");
   if(typeof body.id!=="string")throw Error("Сервер не подтвердил сохранение заявки.");
   status.textContent=(music&&form===music?"Музыкальная заявка":"Отклик")+" сохранена. Номер: "+body.id+". Команда свяжется с тобой по указанному контакту.";
   form.reset();
   return true;
  }catch(e){status.textContent=e.message;return false}
  finally{button.disabled=false}
 };
 if(music){
  const label=music.querySelector("#v2LyricsLabel"),input=music.querySelector('[name="brief"]'),status=document.getElementById("v2MusicStatus");
  const update=()=>{
   const mode=music.elements.lyricsMode.value;
   label.firstChild.textContent=mode==="commission"?"Идея, сюжет и желаемый текст":"Твой текст песни";
   input.placeholder=mode==="commission"?"Опиши, о чём должна быть песня, настроение, историю и пожелания. Написание текста — дополнительная платная услуга.":"Вставь полный текст песни. Можно пометить куплеты и припев.";
  };
  music.addEventListener("change",e=>{if(e.target.name==="lyricsMode")update()});update();
  music.addEventListener("submit",async e=>{
   e.preventDefault();if(!music.reportValidity())return;
   const btn=music.querySelector('button[type="submit"]');
   await submit("/api/v2/music/request",music,status,btn);update()
  });
 }
 if(careers){
  const status=document.getElementById("v2CareersStatus");
  careers.addEventListener("submit",async e=>{
   e.preventDefault();if(!careers.reportValidity())return;
   await submit("/api/v2/careers/apply",careers,status,careers.querySelector('button[type="submit"]'))
  });
 }
})();
