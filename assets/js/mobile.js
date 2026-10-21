// Mobile-only refinements. Desktop Concept 25 remains untouched.
(()=>{
  const hero=document.querySelector('.home-hero');
  const back=document.querySelector('.hero-parallax__back');
  const middle=document.querySelector('.hero-parallax__middle');
  const front=document.querySelector('.hero-parallax__front');
  if(!hero||!back||!middle||!front)return;
  const mq=matchMedia('(max-width: 800px)');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  const smooth=t=>t*t*(3-2*t);
  let raf=0;
  const render=()=>{
    raf=0;
    if(!mq.matches)return;
    const r=hero.getBoundingClientRect();
    // Preserve the accepted parallax travel over the former 16svh runway,
    // without requiring that runway to exist as visible page geometry.
    const range=Math.max(1,innerHeight*.16);
    const raw=reduce.matches?0:clamp(-r.top/range);
    const p=smooth(raw);

    back.style.transform='translate3d(-50%,-34px,0)';
    middle.style.transform=`translate3d(-50%,${-22-p*12}px,0)`;
    front.style.transform=`translate3d(-50%,${-p*34}px,0)`;
    middle.style.opacity='1';
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(render)};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  mq.addEventListener?.('change',()=>location.reload());
  render();
})();
