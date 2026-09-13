(() => {
 const tracks=[1,4,6].map(n=>{const audio=new Audio('audio/book_flip.'+n+'.ogg');audio.preload='auto';audio.volume=.35;return audio});
 let muted=false,track=0;
 try{muted=localStorage.getItem('album-muted')==='true'}catch{}
 const toggle=document.createElement('button');toggle.className='sound-toggle';toggle.type='button';
 const label=()=>{toggle.textContent=muted?'\u0417\u0432\u0443\u043a: \u0432\u044b\u043a\u043b.':'\u0417\u0432\u0443\u043a: \u0432\u043a\u043b.';toggle.setAttribute('aria-pressed',String(!muted))};
 label();document.querySelector('header').append(toggle);
 toggle.addEventListener('click',()=>{muted=!muted;label();if(muted)tracks.forEach(a=>a.pause());try{localStorage.setItem('album-muted',String(muted))}catch{}});
 function rustle(){if(muted)return;const audio=tracks[track++%tracks.length];tracks.forEach(a=>a.pause());audio.currentTime=0;audio.play().catch(()=>{});}
 function hearts(){
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
 window.albumEffects={rustle,hearts};
})();
