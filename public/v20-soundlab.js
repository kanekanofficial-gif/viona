"use strict";
/* SoundLab collects briefs, not payments or unimplemented AI generation. */
(()=>{
 const form=document.getElementById("soundlabForm");
 if(!form)return;
 const field=form.elements.lyricsOrIdea;
 const status=document.getElementById("soundlabStatus");
 const ideaLabel=document.getElementById("soundlabIdeaLabel");
 const submit=form.querySelector('button[type="submit"]');
 const changeTextMode=()=>{
  const artist=form.elements.textMode.value==="artist";
  ideaLabel.firstChild.textContent=artist?"Опиши тему и сюжет песни":"Текст песни";
  field.placeholder=artist?"О чём должна быть песня? Укажи настроение, тему и ключевые образы (написание текста оплачивается дополнительно).":"Вставь свой авторский текст песни...";
 };
 form.addEventListener("change",e=>{if(e.target.name==="textMode")changeTextMode()});
 form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  delete data.consent;
  const previous=submit.textContent;
  submit.disabled=true;status.textContent="Сохраняем музыкальную заявку…";status.className="sl-status";
  try{
   const response=await fetch("/api/v20/music",{
    method:"POST",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},body:JSON.stringify(data)
   });
   const result=await response.json().catch(()=>({}));
   if(!response.ok||!result.ok)throw Error(result.error||"Не удалось сохранить заявку.");
   form.reset();changeTextMode();
   status.textContent="Заявка зарегистрирована: #"+result.id.slice(0,8).toUpperCase()+". Команда ответит по указанному контакту после проверки ТЗ. Оплата пока не проводилась.";
   status.className="sl-status ok";
   status.scrollIntoView({behavior:"smooth",block:"center"});
  }catch(err){
   status.textContent=err.message||"Не удалось отправить запрос. Попробуй позже.";
   status.className="sl-status error";
  }finally{submit.disabled=false}
 });
 changeTextMode();
})();
