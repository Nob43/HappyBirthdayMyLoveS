(() => {
 let played=false;
 window.birthdayCelebration=()=>new Promise(resolve=>{
  if(played){resolve();return}played=true;
  const overlay=document.createElement('div');overlay.className='birthday-celebration';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Happy Birthday');
  overlay.innerHTML='<canvas aria-hidden="true"></canvas><div class="birthday-message"><span class="birthday-spark">✧</span><h2>Happy<br><em>Birthday!</em></h2><p>Майя, это всё для тебя ♡</p></div><button type="button" class="birthday-continue">Продолжить ♡</button>';
  document.body.append(overlay);const previousFocus=document.activeElement;
  const button=overlay.querySelector('button');button.focus({preventScroll:true});
  const canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let width=0,height=0,frame=0,last=0,elapsed=0,burstAt=0,particles=[],finished=false;
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0)}
  resize();window.addEventListener('resize',resize);
  const colors=['#f4d49b','#f0a7b8','#fff0cb','#e599ad','#ffffff'];
  function burst(){const x=width*(.12+Math.random()*.76),y=height*(.12+Math.random()*.48),count=width<700?30:45;for(let i=0;i<count;i++){const angle=Math.PI*2*i/count,speed=55+Math.random()*(width<700?100:155);particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1.3+Math.random()*.5,age:0,color:colors[i%colors.length]})}particles=particles.slice(-180)}
  function draw(time){if(finished)return;const dt=Math.min((time-(last||time))/1000,.04);last=time;elapsed+=dt;
   ctx.clearRect(0,0,width,height);if(elapsed>=burstAt&&elapsed<3.7){burst();burstAt=elapsed+.48}
   particles=particles.filter(p=>p.age<p.life);for(const p of particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=43*dt;ctx.globalAlpha=Math.max(0,1-p.age/p.life);ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.045,p.y-p.vy*.045);ctx.stroke()}ctx.globalAlpha=1;frame=requestAnimationFrame(draw);
  }
  if(ctx&&!reduced)frame=requestAnimationFrame(draw);
  const timer=setTimeout(finish,reduced?2300:4800);
  function finish(){if(finished)return;finished=true;clearTimeout(timer);cancelAnimationFrame(frame);window.removeEventListener('resize',resize);overlay.classList.add('birthday-leaving');setTimeout(()=>{overlay.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});resolve()},reduced?0:450)}
  button.addEventListener('click',finish);
  overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();finish()}if(event.key==='Tab'){event.preventDefault();button.focus()}});
 });
})();
