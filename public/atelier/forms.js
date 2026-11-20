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
 const locale=()=>window.VionaLocale?.get()||"ru";
 const langMap=(ru,en,ja,de)=>({ru,en,ja,de,pink:ru})[locale()]||ru;
 const validGenre=value=>{
  if(typeof value!=="string")return false;
  const genre=value.trim().normalize("NFKC");
  if(genre.length<2||genre.length>48||!/^[\\p{L}\\p{N}][\\p{L}\\p{N}\\p{M} +'&./()_-]*$/u.test(genre))return false;
  return !/(?:opiumcore|mylancore|brazilianfunk|funk|фанк|опиумкор|майланкор)/iu.test(genre.toLowerCase().replace(/[\\s._-]+/g,""));
 };
 if(music){
  const label=music.querySelector("#v2LyricsLabel"),input=music.querySelector('[name="brief"]'),status=document.getElementById("v2MusicStatus");
  const genre=music.querySelector('[name="genre"]');
  genre.addEventListener("input",()=>{genre.setCustomValidity("");status.textContent=""});
  const update=()=>{
   const mode=music.elements.lyricsMode.value;
   label.firstChild.textContent=mode==="commission"
    ?langMap("Идея, сюжет и желаемый текст","Your concept and story","楽曲のアイデア・ストーリー","Deine Songidee und Geschichte")
    :langMap("Твой текст песни","Your song lyrics","あなたの歌詞","Dein Liedtext");
   input.placeholder=mode==="commission"
    ?langMap("Опиши, о чём должна быть песня, настроение, историю и пожелания. Написание текста — дополнительная платная услуга.","Describe the story, mood and ideas. Lyric writing costs extra.","歌の内容、気分、希望を詳しく入力してください。歌詞制作には追加料金がかかります。","Beschreibe Inhalt, Stimmung und Idee. Liedtexte kosten extra.")
    :langMap("Вставь полный текст песни. Можно пометить куплеты и припев.","Paste your full lyrics and label verses and choruses.","歌詞を貼り付け、Aメロ・サビなどを記載してください。","Füge deinen Text ein und markiere Strophen und Refrain.");
  };
  music.addEventListener("change",e=>{if(e.target.name==="lyricsMode")update()});update();
  window.addEventListener("viona:locale",update);
  music.addEventListener("submit",async e=>{
   e.preventDefault();
   if(!validGenre(genre.value)){
    genre.setCustomValidity(langMap("Укажи жанр от 2 до 48 символов. Opiumcore, mylancore и любые виды funk запрещены.","Enter a genre (2–48 characters). Opiumcore, mylancore and funk styles are excluded.","ジャンルを2～48文字で入力してください。Opiumcore、mylancore、funkは不可です。","Bitte Genre (2–48 Zeichen) angeben. Opiumcore, mylancore und Funk sind ausgeschlossen."));
    genre.reportValidity();return;
   }
   genre.setCustomValidity("");
   if(!music.reportValidity())return;
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
