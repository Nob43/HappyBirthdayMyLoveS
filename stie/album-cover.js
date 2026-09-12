(() => {
 const shell=document.querySelector('#album-shell');
 const cover=document.querySelector('#album-cover');
 const album=document.querySelector('#gallery');
 const close=document.querySelector('#close-album');
 let busy=false;
 album.inert=true;
 cover.addEventListener('click',()=>{
  if(busy||!shell.classList.contains('closed'))return;
  busy=true;
  shell.classList.remove('closed');
  shell.classList.add('opening');
  const finish=()=>{
   shell.classList.remove('opening');shell.classList.add('opened');
   album.inert=false;cover.hidden=true;busy=false;
   document.querySelector('#next-page').focus({preventScroll:true});
  };
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)finish();
  else setTimeout(finish,1250);
 });
 close.addEventListener('click',()=>{
  if(busy||!shell.classList.contains('opened')||album.classList.contains('is-turning'))return;
  busy=true;album.inert=true;
  cover.hidden=false;
  shell.classList.add('closing');
  void cover.offsetWidth;
  shell.classList.remove('opened');
  shell.classList.add('closed');
  const finish=()=>{shell.classList.remove('closing');busy=false;cover.focus({preventScroll:true});};
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)finish();
  else setTimeout(finish,1250);
 });
})();
