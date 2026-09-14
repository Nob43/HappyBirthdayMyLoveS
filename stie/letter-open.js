(() => {
 const trigger=document.querySelector('#open-letter'),dialog=document.querySelector('#letter-dialog');
 let running=false,animations=[];
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 async function animate(el,frames,options){
  const animation=el.animate(frames,{fill:'forwards',...options});animations.push(animation);
  await animation.finished;
 }
 function cleanup(){animations.forEach(a=>a.cancel());animations=[];dialog.querySelector('.letter-opening-stage')?.remove();dialog.classList.remove('letter-unwrapping');trigger.style.visibility='';running=false;}
 dialog.addEventListener('close',cleanup);
 trigger.addEventListener('click',async()=>{
  if(running||dialog.open)return;
  if(reduced()){dialog.showModal();return;}
  running=true;
  const stage=document.createElement('div');stage.className='letter-opening-stage';stage.setAttribute('aria-hidden','true');
  stage.innerHTML='<div class="moving-envelope"><div class="envelope-back"></div><div class="envelope-paper"><span>С днём рождения,<br>Майя! ♡</span><i></i><i></i><i></i></div><div class="envelope-pocket"></div><div class="envelope-flap"></div><div class="envelope-seal">♥</div></div>';
  dialog.append(stage);dialog.classList.add('letter-unwrapping');dialog.showModal();
  const envelope=stage.querySelector('.moving-envelope'),seal=stage.querySelector('.envelope-seal'),flap=stage.querySelector('.envelope-flap'),paper=stage.querySelector('.envelope-paper');
  const from=trigger.getBoundingClientRect(),to=envelope.getBoundingClientRect();
  const dx=from.left+from.width/2-to.left-to.width/2,dy=from.top+from.height/2-to.top-to.height/2,scale=trigger.offsetWidth/envelope.offsetWidth;
  trigger.style.visibility='hidden';
  try{
   await animate(envelope,[{transform:`translate(${dx}px,${dy}px) rotate(-4deg) scale(${scale})`},{transform:'translate(0,0) rotate(0deg) scale(1)'}],{duration:750,easing:'cubic-bezier(.2,.75,.25,1)'});
   await animate(seal,[{opacity:1,clipPath:'inset(0 0 0 0)',transform:'scale(1)'},{opacity:.5,offset:.65,clipPath:'inset(0 0 65% 0)',transform:'scale(.97)'},{opacity:0,clipPath:'inset(0 0 100% 0)',transform:'scale(.94)'}],{duration:550,easing:'ease-in-out'});
   await animate(flap,[{transform:'rotateX(0deg)'},{transform:'rotateX(180deg)'}],{duration:650,easing:'cubic-bezier(.35,0,.2,1)'});
   flap.style.zIndex='0';
   await animate(paper,[{transform:'translateY(0)'},{transform:'translateY(-67%)'}],{duration:850,easing:'cubic-bezier(.2,.7,.2,1)'});
   await animate(stage,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(20px)'}],{duration:300,easing:'ease-in'});
   cleanup();
   dialog.querySelector('.letter-copy').animate([{opacity:0,transform:'translateY(25px) scale(.97)'},{opacity:1,transform:'none'}],{duration:550,easing:'cubic-bezier(.2,.7,.2,1)'});
  }catch{cleanup()}
 });
})();
