(() => {
 const dialog=document.querySelector('#photo-dialog');
 const image=document.querySelector('#large-photo');
 const caption=document.querySelector('#photo-caption');
 let source=null,mount=null,busy=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 function origin(){
  const from=source.getBoundingClientRect(),to=image.getBoundingClientRect();
  const matrix=getComputedStyle(mount).transform;
  const angle=matrix==='none'?0:Math.atan2(new DOMMatrix(matrix).b,new DOMMatrix(matrix).a)*180/Math.PI;
  return `translate(${from.left+from.width/2-to.left-to.width/2}px,${from.top+from.height/2-to.top-to.height/2}px) rotate(${angle}deg) scale(${from.width/to.width},${from.height/to.height})`;
 }
 async function open(button){
  if(busy||dialog.open)return;
  busy=true;source=button.querySelector('img');mount=button.querySelector('.photo-mount')||button;
  image.src=source.currentSrc||source.src;image.alt=source.alt;
  caption.textContent='';
  try{await image.decode()}catch{}
  dialog.showModal();
  const transform=origin();
  source.style.visibility='hidden';mount.classList.add('photo-detached');
  if(!reduced()){
   const animation=image.animate([
    {transform,boxShadow:'0 3px 8px #0002'},
    {transform:'translate(0,0) rotate(0deg) scale(1)',boxShadow:'0 22px 65px #0005'}
   ],{duration:650,easing:'cubic-bezier(.2,.75,.2,1)'});
   try{await animation.finished}catch{}
  }
  busy=false;
 }
 async function close(){
  if(busy||!dialog.open)return;
  busy=true;
  if(source?.isConnected&&!reduced()){
   dialog.classList.add('photo-returning');
   const animation=image.animate([{transform:'none'},{transform:origin()}],{duration:550,easing:'cubic-bezier(.4,0,.25,1)',fill:'forwards'});
   try{await animation.finished}catch{}
   dialog.close();animation.cancel();
  }else dialog.close();
  if(source)source.style.visibility='';
  mount?.classList.remove('photo-detached');dialog.classList.remove('photo-returning');busy=false;
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-photo],[data-hero]');
  if(button&&!document.querySelector('#gallery.is-turning'))open(button);
 });
 dialog.querySelector('.close').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
})();
