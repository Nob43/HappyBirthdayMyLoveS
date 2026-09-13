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
  const x=from.left+from.width/2-to.left-to.width/2,y=from.top+from.height/2-to.top-to.height/2;
  const scale=source.offsetWidth/image.offsetWidth;
  return {rest:`translate(${x}px,${y}px) rotate(${angle}deg) scale(${scale})`,lift:`translate(${x}px,${y-22}px) rotate(${angle-2}deg) scale(${scale*1.035})`};
 }
 function fit(){
  const ratio=source.offsetWidth/source.offsetHeight;
  const width=Math.min(innerWidth*.88,1100,(innerHeight-120)*ratio);
  image.style.width=width+'px';image.style.height=width/ratio+'px';
  image.style.objectFit='cover';image.style.objectPosition=getComputedStyle(source).objectPosition;
 }
 async function open(button){
  if(busy||dialog.open)return;
  busy=true;source=button.querySelector('img');mount=button.querySelector('.photo-mount')||button;
  image.src=source.currentSrc||source.src;image.alt=source.alt;
  caption.textContent='';
  try{await image.decode()}catch{}
  fit();dialog.showModal();
  const transform=origin();
  source.style.visibility='hidden';mount.classList.add('photo-detached');
  if(!reduced()){
   const animation=image.animate([
    {transform:transform.rest,boxShadow:'0 3px 8px #0002',offset:0},
    {transform:transform.lift,boxShadow:'0 16px 22px #0003',offset:.28},
    {transform:'translate(0,0) rotate(0deg) scale(1)',boxShadow:'0 22px 65px #0005'}
   ],{duration:1050,easing:'cubic-bezier(.35,0,.2,1)'});
   try{await animation.finished}catch{}
  }
  busy=false;
 }
 async function close(){
  if(busy||!dialog.open)return;
  busy=true;
  if(source?.isConnected&&!reduced()){
   dialog.classList.add('photo-returning');
   const destination=origin();
   const animation=image.animate([{transform:'none',offset:0},{transform:destination.lift,offset:.74},{transform:destination.rest,offset:1}],{duration:950,easing:'cubic-bezier(.35,0,.2,1)',fill:'forwards'});
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
 window.addEventListener('resize',()=>{if(dialog.open&&!busy)fit()});
 dialog.querySelector('.close').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
})();
