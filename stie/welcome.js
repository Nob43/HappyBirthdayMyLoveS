(() => {
 const screen = document.querySelector('#welcome-screen');
 const children = [...document.body.children].filter(el => el !== screen && !['SCRIPT', 'LINK', 'STYLE'].includes(el.tagName));
 children.forEach(el => el.inert = true);
 const buttons = [...screen.querySelectorAll('button')];
 let entering=false;
 async function enter() {
  if(entering||secondScreen)return;entering=true;
  screen.hidden = true;
  await window.birthdayCelebration?.();
  document.body.classList.remove('welcome-open');
  children.forEach(el => el.inert = false);
  document.querySelector('.brand')?.focus({preventScroll: true});
 }
 let secondScreen=false;
 const meme=new Image();meme.src='photos/mem.jpg';
 buttons[0].addEventListener('click',enter);
 const back=document.createElement('button');back.type='button';back.className='welcome-back';back.innerHTML='&#8592;';back.setAttribute('aria-label','Back');back.hidden=true;screen.append(back);
 buttons[1].addEventListener('click',()=>{
  if(entering||secondScreen)return;
  secondScreen=true;screen.classList.add('meme-only');
  screen.removeAttribute('aria-labelledby');screen.setAttribute('aria-label','Photo');
  picture.hidden=false;picture.style.display='block';placeholder.hidden=true;
  picture.src=meme.src;picture.alt='Mem';back.hidden=false;back.focus({preventScroll:true});
 });
 back.addEventListener('click',()=>{
  if(entering)return;
  secondScreen=false;screen.classList.remove('meme-only');back.hidden=true;
  screen.removeAttribute('aria-label');screen.setAttribute('aria-labelledby','welcome-title');
  picture.hidden=false;picture.style.display='block';placeholder.hidden=true;
  picture.src='photos/Welcome.png';picture.alt='Welcome';buttons[0].focus({preventScroll:true});
 });
 screen.addEventListener('keydown', event => {
  if(event.key !== 'Tab') return;
  event.preventDefault();
  if(secondScreen){back.focus();return;}
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
