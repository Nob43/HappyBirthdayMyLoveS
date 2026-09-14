(() => {
 const music=new Audio('audio/happy-moments.ogg');music.loop=true;music.preload='none';music.volume=.12;
 const shell=document.querySelector('#album-shell');
 let context,gain,enabled=true;
 try{enabled=localStorage.getItem('album-music')!=='off'}catch{}
 const button=document.createElement('button');button.type='button';button.className='music-toggle';document.querySelector('.album-controls').after(button);
 function label(){button.textContent=enabled?'♫ Музыка: вкл.':'♫ Музыка: выкл.';button.setAttribute('aria-pressed',String(enabled))}label();
 function allowed(){return enabled&&!window.albumEffects?.isMuted()&&!document.hidden&&(shell.classList.contains('opened')||shell.classList.contains('opening'))}
 function stop(){music.pause()}
 async function play(){
  if(!allowed()){stop();return}
  try{
   const AudioContext=window.AudioContext||window.webkitAudioContext;
   if(!context&&AudioContext){context=new AudioContext();gain=context.createGain();gain.gain.value=0;context.createMediaElementSource(music).connect(gain);gain.connect(context.destination);music.volume=1;}
   if(context){await context.resume();if(!allowed())return;gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setValueAtTime(gain.gain.value,context.currentTime);gain.gain.linearRampToValueAtTime(.10,context.currentTime+1.2)}
   await music.play();if(!allowed())stop();
  }catch{}
 }
 button.addEventListener('click',()=>{enabled=!enabled;label();try{localStorage.setItem('album-music',enabled?'on':'off')}catch{}play()});
 document.querySelector('#album-cover').addEventListener('click',play);
 document.querySelector('#close-album').addEventListener('click',()=>{if(!shell.classList.contains('opened'))stop()});
 document.querySelector('.sound-toggle').addEventListener('click',play);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else play()});
})();
