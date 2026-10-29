/* VIONA — original procedural Cologne-inspired Gothic cathedral.
   WebGL is enabled only in German mode and only while visible. */
if(document.documentElement.dataset.world==="de"){
 const stage=document.getElementById("cathedralStage"),canvas=document.getElementById("cathedralCanvas");
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const narrow=matchMedia("(max-width: 650px)").matches;
 if(stage&&canvas)import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js").then(T=>{
  const renderer=new T.WebGLRenderer({canvas,antialias:!narrow,alpha:false,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,narrow?1.15:1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.42;
  const scene=new T.Scene();scene.background=new T.Color(0x080a12);scene.fog=new T.FogExp2(0x151624,.018);
  const camera=new T.PerspectiveCamera(37,1,.1,110);
  camera.position.set(13,12,32);camera.lookAt(0,8,0);
  const stone=new T.MeshStandardMaterial({color:0x6b6a70,roughness:.9,metalness:.05});
  const stoneLight=new T.MeshStandardMaterial({color:0x969096,roughness:.88});
  const stoneDark=new T.MeshStandardMaterial({color:0x343640,roughness:.95});
  const iron=new T.MeshStandardMaterial({color:0x20232d,roughness:.7,metalness:.28});
  const glass=new T.MeshStandardMaterial({color:0xf6a95f,emissive:0xd57731,emissiveIntensity:1.8,roughness:.45});
  const darkGlass=new T.MeshStandardMaterial({color:0x332d37,emissive:0x4c2d26,emissiveIntensity:.3});
  const gold=new T.MeshStandardMaterial({color:0xc7a580,roughness:.4,metalness:.6});
  const root=new T.Group();scene.add(root);
  const box=(x,y,z,w,h,d,mat=stone)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);root.add(o);return o};
  const cylinder=(x,y,z,r1,r2,h,mat=stone,n=8)=>{const o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,n),mat);o.position.set(x,y,z);root.add(o);return o};
  const cone=(x,y,z,r,h,mat=stone)=>{const o=new T.Mesh(new T.ConeGeometry(r,h,4),mat);o.rotation.y=Math.PI/4;o.position.set(x,y,z);root.add(o);return o};
  const arch=(x,y,z,w,h,mat=stoneDark)=>{box(x,y-h*.22,z,w,h*.56,.06,mat);cone(x,y+h*.23,z,w*.65,h*.46,mat)};
  const line=(x,y,z,w,h=.045,d=.07,mat=stoneLight)=>box(x,y,z,w,h,d,mat);
  // Main nave and transept, deep roofline and heavy stone foundations.
  box(0,3.15,-2.3,8.7,6.3,8.8,stone);
  box(0,5.8,-2.3,7.5,1.4,7.6,stoneDark);
  cone(0,7.3,-2.3,5.3,2.9,stoneDark);
  box(0,.34,2.6,12.7,.68,4.4,stoneDark);
  box(0,3.9,2.3,8.9,7.8,2.1,stone);
  box(0,7.8,2.3,9.6,.35,2.4,stoneLight);
  // Two Cologne-style soaring Gothic west towers: layered octagonal stages.
  for(const side of [-1,1]){
   const x=side*4.15,z=2.15;
   box(x,5.6,z,3.25,11.2,3.1,stone);
   for(const h of [2.3,5.1,8.1,10.8])box(x,h,z+1.63,3.6,.24,.38,stoneLight);
   for(const dx of [-1.32,1.32]){
    box(x+dx,5.4,z+1.65,.18,10.7,.28,stoneLight);
    for(const y of [3.4,7.2,10.4])cone(x+dx,y,z+1.7,.33,.85,stoneLight);
   }
   for(const y of [3.2,6.15,9.1]){
    for(const dx of [-.76,.76]){
     arch(x+dx,y,z+1.69,.82,2.05,iron);
     arch(x+dx,y-.06,z+1.75,.56,1.52,y===3.2?glass:darkGlass);
     box(x+dx,y-.35,z+1.82,.08,1.45,.07,stoneLight);
    }
   }
   box(x,11.6,z,2.9,1.25,2.9,stone);
   cylinder(x,12.65,z,1.35,1.25,1.2,stoneLight,8);
   cylinder(x,13.6,z,1.05,1.35,.85,stoneDark,8);
   cone(x,16.3,z,1.2,5.3,stoneLight);
   // Needle pinnacles and flying corner finials.
   for(const dx of [-1.37,1.37])for(const dz of [-1.37,1.37]){
    box(x+dx,11.95,z+dz,.3,1.4,.3,stoneLight);
    cone(x+dx,13.2,z+dz,.31,1.5,stoneLight);
   }
   cylinder(x,19.15,z,.045,.045,.65,gold,6);
   // Buttresses extending along side aisles.
   for(const zz of [-5.2,-2.9,-.6]){box(side*4.35,3.9,zz,1.25,7.2,.75,stoneDark);cone(side*4.35,8,zz,.62,1.8,stoneLight)}
  }
  // Rich west façade: clustered columns, pointed arches, tracery and rose window.
  box(0,5.15,3.53,4.9,10.2,.7,stoneLight);
  for(const x of [-2.25,-1.4,-.48,.48,1.4,2.25])box(x,5.5,3.96,.16,9.9,.2,stone);
  for(const x of [-1.65,0,1.65]){
   arch(x,3.2,4.05,1.25,4.4,iron);
   arch(x,3.2,4.12,.88,3.45,x===0?glass:darkGlass);
   for(const xx of [-.28,.28])box(x+xx,2.7,4.2,.065,2.4,.05,gold);
  }
  for(const x of [-1.65,0,1.65]){arch(x,7.25,4.04,1.15,2.65,iron);arch(x,7.25,4.11,.72,1.85,glass)}
  const rose=new T.Mesh(new T.TorusGeometry(.91,.12,9,20),stoneLight);rose.position.set(0,9.9,4.1);root.add(rose);
  const center=new T.Mesh(new T.CircleGeometry(.7,24),glass);center.position.set(0,9.9,4.04);root.add(center);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const spoke=box(Math.sin(a)*.42,9.9+Math.cos(a)*.42,4.16,.065,.84,.06,stoneDark);spoke.rotation.z=-a}
  for(const x of [-2.2,2.2]){cone(x,10.6,4.1,.65,2.3,stoneLight)}
  // Aisle windows, buttresses and tall lancet arches down the nave.
  for(const side of [-1,1])for(let i=0;i<4;i++){
   const z=1-i*1.9;
   arch(side*4.42,5.2,z,.78,3.1,iron);
   box(side*4.47,4.6,z,.08,1.5,.55,glass);
  }
  // Cobbled square and gothic atmosphere.
  const ground=new T.Mesh(new T.PlaneGeometry(180,180),new T.MeshStandardMaterial({color:0x12141c,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;scene.add(ground);
  for(let i=0;i<28;i++){const z=4.8+i*.34;box(0,.035,z,13,.05,.025,i%3?stoneDark:stone)}
  scene.add(new T.HemisphereLight(0x9094bb,0x21151a,2.2));
  const key=new T.DirectionalLight(0xc5d3f4,3);key.position.set(-9,19,13);scene.add(key);
  const warm=new T.PointLight(0xffa35e,65,27,1.5);warm.position.set(3,8,10);scene.add(warm);
  const cool=new T.PointLight(0x8c9cda,42,26,1.5);cool.position.set(-9,14,-4);scene.add(cool);
  // Minimal atmospheric particles; capped for mobile.
  const count=narrow?45:95,coords=new Float32Array(count*3);
  for(let i=0;i<count;i++){coords[i*3]=(Math.random()-.5)*32;coords[i*3+1]=Math.random()*22;coords[i*3+2]=(Math.random()-.5)*23}
  const particles=new T.BufferGeometry();particles.setAttribute("position",new T.BufferAttribute(coords,3));
  const mist=new T.Points(particles,new T.PointsMaterial({color:0xc4b1a5,size:.06,transparent:true,opacity:.42,sizeAttenuation:true}));scene.add(mist);
  let visible=true,frame=0,last=0,raf=0;
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<500?49:37;camera.updateProjectionMatrix()}
  const ro=new ResizeObserver(resize);ro.observe(stage);resize();
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(tick)});io.observe(stage);
  const start=performance.now();
  function tick(t){raf=0;if(!visible||document.hidden)return;if(t-last<40&&!reduced){raf=requestAnimationFrame(tick);return}last=t;const sec=(t-start)*.001;
   if(!reduced){camera.position.x=13+Math.sin(sec*.17)*1.7;camera.position.y=12+Math.sin(sec*.12)*.32;camera.lookAt(0,8.8,0);warm.intensity=58+Math.sin(sec*1.3)*4;mist.position.x=Math.sin(sec*.13)*.55}
   renderer.render(scene,camera);if(!reduced)raf=requestAnimationFrame(tick)
  }
  stage.classList.add("ready");raf=requestAnimationFrame(tick);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&visible&&!raf)raf=requestAnimationFrame(tick)});
  window.addEventListener("pagehide",()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();renderer.dispose()},{once:true});
 }).catch(()=>{stage?.classList.add("webgl-fallback")});
}
