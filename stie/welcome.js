(() => {
 const screen = document.querySelector('#welcome-screen');
 const children = [...document.body.children].filter(el => el !== screen && !['SCRIPT', 'LINK', 'STYLE'].includes(el.tagName));
 children.forEach(el => el.inert = true);
 const buttons = [...screen.querySelectorAll('button')];
 function enter() {
  screen.hidden = true;
  document.body.classList.remove('welcome-open');
  children.forEach(el => el.inert = false);
  document.querySelector('.brand')?.focus({preventScroll: true});
 }
 buttons.forEach(button => button.addEventListener('click', enter));
 screen.addEventListener('keydown', event => {
  if(event.key !== 'Tab') return;
  event.preventDefault();
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
