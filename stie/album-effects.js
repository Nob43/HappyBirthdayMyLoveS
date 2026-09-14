(() => {
 const tracks=[1,4,6].map(n=>{const audio=new Audio('audio/book_flip.'+n+'.ogg');audio.preload='auto';audio.volume=.35;return audio});
 const opening=new Audio('audio/bookOpen.ogg'),closing=new Audio('audio/bookClose.ogg');
 opening.preload=closing.preload='auto';opening.volume=.35;closing.volume=.25;
 const chimes=new Audio('audio/heart-chimes.wav');chimes.preload='auto';chimes.volume=.28;
 const fireworks=[1,2,3].map(n=>{const a=new Audio('audio/fw_0'+n+'.ogg');a.preload='auto';a.volume=.13;return a});let fireworkIndex=0;
 const stopFireworks=()=>fireworks.forEach(a=>{a.pause();a.currentTime=0});
 const firework=()=>{if(muted)return;const a=fireworks[fireworkIndex++%fireworks.length];a.currentTime=0;a.play().catch(()=>{});};
 const letterSounds=Object.fromEntries(['pickup','seal','flap','paper'].map(name=>{const a=new Audio('audio/letter-'+name+'.ogg');a.preload='auto';a.volume=name==='seal'?.14:.22;return [name,a]}));
 const stopLetter=()=>Object.values(letterSounds).forEach(a=>{a.pause();a.currentTime=0});
 const letterSound=name=>{stopLetter();if(muted)return;const a=letterSounds[name];if(a)a.play().catch(()=>{});};
 const allSounds=[...tracks,opening,closing,chimes,...fireworks,...Object.values(letterSounds)];
 function coverSound(audio){if(muted)return;allSounds.forEach(a=>a.pause());audio.currentTime=0;audio.play().catch(()=>{});}
 let muted=false,track=0;
 try{muted=localStorage.getItem('album-muted')==='true'}catch{}
 const toggle=document.createElement('button');toggle.className='sound-toggle';toggle.type='button';
 const label=()=>{toggle.textContent=muted?'\u0417\u0432\u0443\u043a: \u0432\u044b\u043a\u043b.':'\u0417\u0432\u0443\u043a: \u0432\u043a\u043b.';toggle.setAttribute('aria-pressed',String(!muted))};
 label();document.querySelector('header').append(toggle);
 toggle.addEventListener('click',()=>{muted=!muted;label();if(muted)allSounds.forEach(a=>a.pause());try{localStorage.setItem('album-muted',String(muted))}catch{}});
 function rustle(){if(muted)return;const audio=tracks[track++%tracks.length];allSounds.forEach(a=>a.pause());audio.currentTime=0;audio.play().catch(()=>{});}
 function hearts(){
  if(!muted){chimes.currentTime=0;chimes.play().catch(()=>{}); }
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const shell=document.querySelector('#album-shell');
  const layer=document.createElement('div');layer.className='album-heart-layer';layer.setAttribute('aria-hidden','true');
  shell.append(layer);
  for(let i=0;i<9;i++){
   const heart=document.createElement('span');heart.className='album-floating-heart';heart.textContent='♥';
   heart.style.fontSize=(22+(i%4)*7)+'px';layer.append(heart);
   const x=(i-4)*35,y=-110-(i%3)*40,rotation=(i%2?1:-1)*(10+i*3);
   heart.animate([
    {transform:'translate(-50%,0) scale(.35) rotate(0deg)',opacity:0},
    {opacity:.95,offset:.18},
    {transform:`translate(calc(-50% + ${x}px),${y}px) scale(1) rotate(${rotation}deg)`,opacity:.9,offset:.7},
    {transform:`translate(calc(-50% + ${x*1.15}px),${y-65}px) scale(.75) rotate(${rotation+12}deg)`,opacity:0}
   ],{duration:1500+i%3*120,delay:i*55,easing:'cubic-bezier(.2,.6,.35,1)',fill:'both'});
  }
  setTimeout(()=>layer.remove(),2300);
 }
 window.albumEffects={isMuted:()=>muted,letterSound,stopLetter,rustle,hearts,firework,stopFireworks,openBook:()=>coverSound(opening),closeBook:()=>coverSound(closing)};
})();
