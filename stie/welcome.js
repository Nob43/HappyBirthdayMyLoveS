(() => {
 const screen = document.querySelector('#welcome-screen');
 const children = [...document.body.children].filter(el => el !== screen && !['SCRIPT', 'LINK', 'STYLE'].includes(el.tagName));
 children.forEach(el => el.inert = true);
 const buttons = [...screen.querySelectorAll('button')];
 let entering=false;
 async function enter() {
  if(entering)return;entering=true;
  await window.birthdayCelebration?.();
  screen.hidden = true;
  document.body.classList.remove('welcome-open');
  children.forEach(el => el.inert = false);
  document.querySelector('.brand')?.focus({preventScroll: true});
 }
 let secondScreen=false;
 const meme=new Image();meme.src='photos/mem.jpg';
 buttons[0].addEventListener('click',enter);
 buttons[1].addEventListener('click',async()=>{
  if(secondScreen){enter();return;}
  if(entering)return;entering=true;
  await window.birthdayCelebration?.();
  entering=false;
  secondScreen=true;
  screen.classList.add('meme-only');
  screen.removeAttribute('aria-labelledby');screen.setAttribute('aria-label','Photo');
  picture.tabIndex=0;picture.setAttribute('role','button');
  picture.addEventListener('click',enter,{once:true});
  picture.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();enter();}});
  picture.hidden=false;picture.style.display='block';placeholder.hidden=true;
  picture.src=meme.src;picture.alt='Mem';
  picture.focus({preventScroll:true});
 });
 screen.addEventListener('keydown', event => {
  if(event.key !== 'Tab') return;
  event.preventDefault();
  if(secondScreen){picture.focus();return;}
  buttons[document.activeElement === buttons[0] ? 1 : 0].focus();
 });
 document.addEventListener('keydown', event => {
  if(!screen.hidden && ['ArrowLeft','ArrowRight'].includes(event.key)) event.stopImmediatePropagation();
 }, true);
 const picture = document.querySelector('#welcome-picture');
 const placeholder = document.querySelector('#welcome-placeholder');
 function missingPicture(){picture.hidden = true;picture.style.display = 'none';placeholder.hidden = false;}
 picture.addEventListener('error', missingPicture);
 if(picture.complete && !picture.naturalWidth) missingPicture();
 buttons[0].focus({preventScroll: true});
})();
