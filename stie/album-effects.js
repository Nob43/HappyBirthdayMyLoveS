(() => {
 let context, noise;
 let muted=false;
 try{muted=localStorage.getItem('album-muted')==='true'}catch{}
 const toggle=document.createElement('button');
 toggle.className='sound-toggle';toggle.type='button';
 const label=()=>{toggle.textContent=muted?'Звук: выкл.':'Звук: вкл.';toggle.setAttribute('aria-pressed',String(!muted));};
 label();document.querySelector('header').append(toggle);
 function unlock(){
  if(muted)return;
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
   if(!context){
    context=new Audio();noise=context.createBuffer(1,Math.ceil(context.sampleRate*.6),context.sampleRate);
    const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
   }
   if(context.state==='suspended')context.resume().catch(()=>{});
  }catch{}
 }
 toggle.addEventListener('click',()=>{muted=!muted;label();try{localStorage.setItem('album-muted',String(muted))}catch{}if(!muted)unlock()});
 document.addEventListener('pointerdown',unlock,{passive:true});
 document.addEventListener('keydown',unlock);
 function rustle(){
  unlock();if(muted||!context||context.state!=='running')return;
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=noise;filter.type='bandpass';filter.Q.value=.65;
  const t=context.currentTime;
  filter.frequency.setValueAtTime(1100,t);filter.frequency.exponentialRampToValueAtTime(2600,t+.15);filter.frequency.exponentialRampToValueAtTime(700,t+.52);
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.11,t+.055);gain.gain.linearRampToValueAtTime(.025,t+.17);gain.gain.linearRampToValueAtTime(.075,t+.27);gain.gain.exponentialRampToValueAtTime(.001,t+.55);
  source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start();source.stop(t+.58);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
 }
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
