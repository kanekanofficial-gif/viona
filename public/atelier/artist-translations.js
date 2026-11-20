"use strict";
(()=>{
 const chapters=[...document.querySelectorAll(".bio-chapter")];
 if(!chapters.length)return;
 const originals=chapters.map(el=>({
  label:el.querySelector("aside p").innerHTML,
  heading:el.querySelector("h3").innerHTML,
  paras:[...el.querySelectorAll(":scope > div > p")].map(p=>p.innerHTML)
 }));
 const soundDescriptions=[...document.querySelectorAll(".genre-grid article p")];
 const originalSounds=soundDescriptions.map(p=>p.innerHTML);
 const cta=document.querySelector(".artist-action p"),ctaLink=document.querySelector(".artist-action>a");
 const ctaBase=cta?.innerHTML,linkBase=ctaLink?.innerHTML;
 const translated={
 en:[
 ["Origins","The urge to create appeared before the first song.",[
 "KANEKAN KAN did not begin his journey to music on a professional stage or through a famous musical project. As a child he was fascinated by how digital things worked and how he could make something himself. <strong>He started learning programming and writing code at the age of seven.</strong> Curiosity gradually became a way to turn ideas into something real.",
 "Over time, his creative interests extended far beyond programming. He was drawn to the way images, rhythm and sound can establish a mood without many words. This interest gradually led to <strong>car video editing</strong>, and later to composing his own tracks. Technology still matters to him, but <strong>music has become the center of his creative life.</strong>"
 ]],
 ["Childhood & experience","Events that remain part of his personal story.",[
 "KANEKAN KAN's childhood was not entirely carefree. According to the artist, there was a period when <strong>he went missing for three days</strong>. After he was found, it became clear he had been in a dangerous situation involving a threat of violence from an adult. It remains a difficult part of his past, which he chooses to discuss without sensationalism or unnecessary detail.",
 "KANEKAN KAN has also undergone <strong>three operations</strong>. Following an injury, he has <strong>a plate replacing part of his skull bone</strong>. These events belong to his history, but they do not define him. He emphasizes that <strong>today he is happy, enjoys life</strong>, and continues developing his interests.",
 "His work is not built solely around painful memories. It also contains contrast, personal feelings, curiosity about others, the freedom to experiment with music and the wish to create something new."
 ]],
 ["Visual creativity","Car edits and a sense of rhythm.",[
 "Before music took a central place in his life, KANEKAN KAN was passionate about <strong>automotive video editing</strong>. His edits involved tempo, movement, transitions, synchronization of shots and accents in the music. To make a short video compelling, he had to feel the melody and know exactly when a visual moment should happen.",
 "That experience slowly shaped how he heard music. Rhythm, the density of a sound, shifts in intensity and contrasts between calm and powerful passages became more than technical techniques: they became part of his creative approach."
 ]],
 ["Summer 2026","His first original tracks in FL Studio.",[
 "<strong>In the summer of 2026, KANEKAN KAN began producing music in FL Studio.</strong> It was a continuation of his long-standing interest in digital creation, with melodies, drums, guitars, synthesizer textures and vocals becoming his new tools.",
 "He explored different arrangements in search of a sound that could convey emotion. Two musical worlds stood out: <strong>witch house</strong>, with long atmospheric synthesizers, and <strong>rock</strong>, with impactful drums, rich guitars and melodic contrasts.",
 "Within rock, he is particularly drawn to <strong>pop-punk, hard rock, alternative rock and zoomergaze</strong>. He enjoys the transition from quiet or nearly acoustic passages into powerful choruses, and wants the drums to remain prominent rather than hidden behind other instruments. Expressive rhythm and emotion matter most to him."
 ]],
 ["Original technology","AI vocals as part of a musical identity.",[
 "Another part of KANEKAN KAN's creative story is <strong>his own AI-based vocal-synthesis solution</strong>. According to the artist, instead of recording his natural voice for his musical projects, he uses a system he developed and configured himself.",
 "<strong>He spent approximately a year developing and fine-tuning it.</strong> The system analyzes musical tags, lyrics, mood, the context of a song and desired performance traits. His goal was a beautiful, bright and melodic vocal style that suits the character of each track.",
 "For KANEKAN KAN, it is not simply a sound effect. AI vocals help him experiment with his own sound concept, use female or male vocal styles for different tasks and search for emotional expression without relying on recordings of his natural voice.",
 "The technology remains <strong>a private, closed creative tool</strong>. He has no plans to release the original system publicly. He uses it in his own music and continues improving it."
 ]],
 ["Today","Witch house, rock and the search for something new.",[
 "KANEKAN KAN continues making original compositions. His core directions are <strong>witch house and rock</strong>, including pop-punk, hard rock, alternative rock and zoomergaze. He experiments with instruments, emotion, song structures and vocal approaches.",
 "In witch house, he values long soundscapes, synthesizers and atmosphere. In pop-punk, he loves loud drums, guitar energy and memorable melodies. Hard rock offers power and expressive solos; zoomergaze brings the contrast of delicate, quiet sections and massive distorted choruses.",
 "For him, music is a way to turn ideas and feelings into sound. He remains interested in digital creation, video editing and technology, but <strong>his music and personal sonic identity are the heart of his artistic journey</strong>.",
 "The story is ongoing. KANEKAN KAN does not limit himself to one genre or believe he has found the final form of his music. Staying curious, growing and enjoying creation remain essential to him."
 ]]
 ],
 ja:[
 ["原点","最初の曲より先に、ものづくりへの思いがあった。",[
 "KANEKAN KANの音楽への道は、プロのステージや有名な音楽プロジェクトから始まったわけではありません。子どもの頃からデジタルの仕組みや、自分で何かを作ることに興味がありました。<strong>7歳からプログラミングとコード制作を学び始め</strong>、好奇心は次第に自分のアイデアを実現する力になっていきました。",
 "やがて創作への関心はプログラミングだけにとどまらなくなります。映像、リズム、音が言葉を使わずに雰囲気を伝えられることに惹かれ、<strong>自動車の動画編集</strong>、そして自分の楽曲制作へとつながりました。テクノロジーはいまも大切な道具ですが、<strong>創作の中心にあるのは音楽です。</strong>"
 ]],
 ["幼少期と人生経験","個人的な歴史に残る出来事。",[
 "KANEKAN KANの子ども時代には、難しい出来事もありました。本人によれば、<strong>3日間行方が分からなくなった</strong>時期があり、その後、成人から暴力の脅威を受ける危険な状況に置かれていたことが分かりました。本人はこの経験を、過度にセンセーショナルにすることなく語っています。",
 "また、KANEKAN KANは<strong>3回の手術</strong>を受けています。けがの影響で、<strong>頭蓋骨の一部を補うプレート</strong>が入っています。これらは人生の一部ですが、本人のすべてではありません。<strong>いまは幸せで、人生を楽しみながら</strong>好きな創作を続けていると語ります。",
 "彼の音楽はつらい記憶だけを題材にしているわけではありません。対比や個人的な感情、人への関心、音楽を試す自由、そして新しいものを作りたいという気持ちも表れています。"
 ]],
 ["映像の創作","車のエディットとリズム感。",[
 "音楽が特別な存在になる以前、KANEKAN KANの創作活動の一つは<strong>車の動画編集</strong>でした。テンポ、動き、トランジション、映像と音の同期を考え、短い動画の中で印象的な瞬間を作るためにメロディーとタイミングを感じ取っていました。",
 "その経験は、音楽の聴き方にも影響を与えました。リズムや音の厚み、緊張感の変化、静かな部分と力強い部分の対比は、単なる技術ではなく本人の表現方法の一部になりました。"
 ]],
 ["2026年 夏","FL Studioで始めたオリジナル曲制作。",[
 "<strong>2026年の夏、KANEKAN KANはFL Studioで音楽制作を始めました。</strong>長年のデジタル創作への関心が、メロディー、ドラム、ギター、シンセサイザー、ボーカルという新たな素材へと広がったのです。",
 "感情を伝える音を探しながら、さまざまなアレンジを試しました。特に惹かれたのは、長く続くシンセと雰囲気を特徴とする<strong>ウィッチハウス</strong>と、力強いドラム、厚いギター、メロディーの対比を持つ<strong>ロック</strong>でした。",
 "ロックの中でも<strong>ポップパンク、ハードロック、オルタナティブロック、ズーマーゲイズ</strong>が好きです。静かな、またはアコースティックな部分から大きなサビへ変化する構成や、他の楽器に埋もれないドラムの存在感を大切にしています。"
 ]],
 ["独自の技術","音楽性の一部となったAIボーカル。",[
 "KANEKAN KANの創作のもう一つの特徴は、<strong>独自に開発したAIによるボーカル合成システム</strong>です。本人によると、楽曲では自分の自然な声を録音する代わりに、自ら開発・調整したシステムを使っています。",
 "<strong>開発と調整にはおよそ1年を費やしました。</strong>音楽タグ、歌詞、曲の雰囲気、文脈、求める歌い方などを分析し、楽曲ごとに明るく美しいメロディックな表現を目指してきました。",
 "彼にとってAIボーカルは単なるエフェクトではありません。曲に合わせて女性・男性の声の表現を選び、自然な声の録音に頼らずに感情を伝えるための、独自の音楽的な道具です。",
 "この技術は<strong>本人専用の非公開ツール</strong>です。一般公開する予定はなく、自分の音楽のために使いながら改善を続けています。"
 ]],
 ["現在","ウィッチハウス、ロック、そして新しい音への探求。",[
 "KANEKAN KANは現在もオリジナル楽曲を作り続けています。中心となるのは<strong>ウィッチハウスとロック</strong>で、ポップパンク、ハードロック、オルタナティブロック、ズーマーゲイズも含まれます。楽器、感情、曲の構成、ボーカルを試しています。",
 "ウィッチハウスでは長い音の広がりとシンセ、ポップパンクでは大きなドラムとギター、ハードロックでは迫力とソロ、ズーマーゲイズでは繊細な場面と歪んだサビの対比を大切にします。",
 "音楽はアイデアと感情を音に変える手段です。デジタル制作、映像編集、テクノロジーにも関心を持ち続けていますが、<strong>自分の音楽とサウンドが創作活動の中心</strong>です。",
 "彼の物語はまだ続いています。一つのジャンルや完成形に縛られず、実験する楽しさ、成長すること、創作そのものの喜びを大切にしています。"
 ]]
 ],
 de:[
 ["Ursprünge","Der Wunsch, etwas zu erschaffen, kam vor dem ersten Song.",[
 "KANEKAN KAN begann seine musikalische Reise weder auf einer professionellen Bühne noch mit einem bekannten Musikprojekt. Schon als Kind interessierte ihn, wie digitale Dinge funktionieren und wie er selbst etwas erschaffen konnte. <strong>Mit sieben Jahren begann er, Programmieren und das Schreiben von Code zu lernen.</strong> Aus Neugier wurde nach und nach die Fähigkeit, eigene Ideen umzusetzen.",
 "Sein Interesse an Kreativität ging bald weit über das Programmieren hinaus. Er begeisterte sich dafür, wie Bilder, Rhythmus und Klang ohne viele Worte eine Atmosphäre erzeugen. Das führte ihn zunächst zum <strong>Videoschnitt mit Autos</strong> und später zum Komponieren eigener Stücke. Technologie ist weiterhin wichtig, aber <strong>Musik steht heute im Mittelpunkt seines kreativen Lebens.</strong>"
 ]],
 ["Kindheit und Erfahrungen","Ereignisse, die Teil seiner persönlichen Geschichte bleiben.",[
 "Die Kindheit von KANEKAN KAN war nicht durchgehend unbeschwert. Nach eigenen Angaben gab es eine Zeit, in der <strong>er drei Tage lang vermisst wurde</strong>. Nach seinem Auffinden stellte sich heraus, dass er sich in einer gefährlichen Situation befunden hatte, in der ihm durch einen Erwachsenen Gewalt drohte. Er spricht darüber ohne Sensationslust oder unnötige Einzelheiten.",
 "Außerdem hat KANEKAN KAN <strong>drei Operationen</strong> durchgemacht. Nach einer Verletzung trägt er <strong>eine Platte, die einen Teil des Schädelknochens ersetzt</strong>. Diese Erfahrungen gehören zu seinem Leben, definieren ihn aber nicht als Person. Er betont, dass <strong>er heute glücklich ist, das Leben genießt</strong> und seinen Interessen weiter nachgeht.",
 "Seine Musik besteht nicht ausschließlich aus schweren Erinnerungen. Sie enthält auch Kontraste, persönliche Gefühle, Neugier auf Menschen, die Freiheit zum Experimentieren und den Wunsch, Neues zu erschaffen."
 ]],
 ["Visuelle Kreativität","Auto-Edits und ein Gefühl für Rhythmus.",[
 "Bevor Musik einen besonderen Stellenwert bekam, beschäftigte sich KANEKAN KAN leidenschaftlich mit <strong>Automobil-Videobearbeitung</strong>. In seinen Edits arbeitete er mit Tempo, Bewegung, Übergängen, Bildsynchronisation und musikalischen Akzenten. Für die Wirkung eines kurzen Videos musste er Melodien spüren und den richtigen Moment im Bild treffen.",
 "Diese Erfahrung prägte allmählich seine Wahrnehmung von Musik. Rhythmus, Klangdichte, Spannungswechsel und der Kontrast zwischen ruhigen und kraftvollen Momenten wurden mehr als technische Tricks – sie wurden Teil seines kreativen Ausdrucks."
 ]],
 ["Sommer 2026","Die ersten eigenen Tracks in FL Studio.",[
 "<strong>Im Sommer 2026 begann KANEKAN KAN, in FL Studio Musik zu produzieren.</strong> Es war die Fortsetzung seines langjährigen Interesses an digitaler Gestaltung. Nun wurden Melodien, Drums, Gitarren, Synthesizer-Texturen und Gesang zu seinen Werkzeugen.",
 "Er experimentierte mit verschiedenen Arrangements auf der Suche nach einem Klang, der Gefühle vermitteln konnte. Besonders faszinierten ihn zwei Welten: <strong>Witch House</strong> mit langen atmosphärischen Synthesizern und <strong>Rock</strong> mit kraftvollen Drums, dichten Gitarren und melodischen Kontrasten.",
 "Innerhalb des Rock interessieren ihn vor allem <strong>Pop-Punk, Hard Rock, Alternative Rock und Zoomergaze</strong>. Er liebt es, wenn leise oder fast akustische Passagen in einen mächtigen Refrain übergehen und die Drums nicht hinter anderen Instrumenten verschwinden. Ausdrucksstarker Rhythmus und Emotion sind entscheidend."
 ]],
 ["Eigene Technologie","KI-Gesang als Teil seiner musikalischen Identität.",[
 "Ein weiterer Teil seiner kreativen Geschichte ist <strong>sein selbst entwickeltes KI-System zur Stimmsynthese</strong>. Nach Angaben des Künstlers verwendet er in seinen Songs statt Aufnahmen seiner natürlichen Stimme ein System, das er selbst entwickelt und abgestimmt hat.",
 "<strong>Etwa ein Jahr arbeitete er an Entwicklung und Feinabstimmung.</strong> Die Lösung analysiert Musik-Tags, Texte, Stimmung, Kontext und gewünschte Merkmale der Interpretation. Sein Ziel war ein schöner, heller und melodischer Gesang, der zum Charakter des jeweiligen Songs passt.",
 "Für KANEKAN KAN ist dies kein einfacher Klangeffekt. KI-Gesang ermöglicht ihm, seine Klangidee umzusetzen, weibliche oder männliche Stimmlagen für verschiedene Projekte zu wählen und emotionale Ausdrucksformen unabhängig von Aufnahmen der eigenen natürlichen Stimme zu erforschen.",
 "Die Technologie bleibt <strong>ein privates, nicht veröffentlichtes Kreativwerkzeug</strong>. Er plant nicht, das System öffentlich zugänglich zu machen, sondern verwendet und verbessert es weiterhin für seine eigene Musik."
 ]],
 ["Heute","Witch House, Rock und die Suche nach Neuem.",[
 "KANEKAN KAN produziert weiterhin eigene Kompositionen. Seine wichtigsten Stile sind <strong>Witch House und Rock</strong>, darunter Pop-Punk, Hard Rock, Alternative Rock und Zoomergaze. Er experimentiert mit Instrumenten, Stimmung, Songstruktur und Gesang.",
 "An Witch House mag er lange Klangflächen, Synthesizer und Atmosphäre. Pop-Punk bedeutet für ihn laute Drums, Gitarrenenergie und einprägsame Melodien. Hard Rock bietet Kraft und ausdrucksstarke Soli; Zoomergaze verbindet zerbrechliche, ruhige Momente mit massiven, verzerrten Refrains.",
 "Musik ist für ihn ein Weg, Ideen und Gefühle in Klang zu verwandeln. Digitale Gestaltung, Videoschnitt und Technologie interessieren ihn weiterhin, doch <strong>seine Musik und der eigene Klang stehen im Zentrum seines künstlerischen Weges</strong>.",
 "Diese Geschichte geht weiter. KANEKAN KAN beschränkt sich nicht auf ein Genre und glaubt nicht, schon eine endgültige Form seiner Musik gefunden zu haben. Neugier, Entwicklung und Freude am Schaffen bleiben ihm wichtig."
 ]]
 ]
};
const details={
 en:{genres:["Long synth textures, soundscapes and atmosphere.","Powerful drums, guitars and melodic choruses.","Dense guitars, intense dynamics and expressive solos.","Intimate sections evolving into large distorted climaxes."],cta:"Tell us what your future track should be about, then choose a genre, vocal style and mood. Every request is reviewed individually.",link:"Request a music track ↗"},
 ja:{genres:["長いシンセの音と広がりのある雰囲気。","力強いドラム、ギター、メロディックなサビ。","厚いギター、ダイナミクス、印象的なソロ。","繊細な場面から大きな歪んだクライマックスへ。"],cta:"楽曲のテーマ、ジャンル、声、雰囲気を伝えてください。依頼は一件ずつ検討します。",link:"楽曲を依頼する ↗"},
 de:{genres:["Lange Synthesizer-Flächen, Klanglandschaften und Atmosphäre.","Kraftvolle Drums, Gitarren und melodische Refrains.","Dichte Gitarren, dynamisches Spiel und ausdrucksstarke Soli.","Intime Passagen, die sich in gewaltige verzerrte Höhepunkte verwandeln."],cta:"Beschreibe deinen zukünftigen Track, wähle Genre, Gesang und Stimmung. Jede Anfrage wird individuell geprüft.",link:"Musik anfragen ↗"}
};
function apply(){
 const code=window.VionaLocale?.get()||"ru",val=translated[code],info=details[code];
 for(let i=0;i<chapters.length;i++){
  const node=chapters[i],chapter=val?.[i],base=originals[i];
  node.querySelector("aside p").innerHTML=chapter?chapter[0]:base.label;
  node.querySelector("h3").innerHTML=chapter?chapter[1]:base.heading;
  const ps=[...node.querySelectorAll(":scope > div > p")];
  for(let j=0;j<ps.length;j++)ps[j].innerHTML=chapter?.[2]?.[j]||base.paras[j];
 }
 soundDescriptions.forEach((node,i)=>{node.innerHTML=info?.genres[i]||originalSounds[i]});
 if(cta)cta.innerHTML=info?.cta||ctaBase;
 if(ctaLink)ctaLink.innerHTML=info?.link||linkBase;
}
window.addEventListener("viona:locale",apply);
apply();
})();
