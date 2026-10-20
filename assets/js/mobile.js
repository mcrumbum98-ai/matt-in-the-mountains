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
    const range=Math.max(1,hero.offsetHeight-innerHeight);
    const raw=reduce.matches?0:clamp(-r.top/range);
    const p=smooth(raw);
    // Final mobile edge-protection pass: keep the foreground curtain lower and
    // move it only enough to suggest depth. This preserves the original pixels
    // while preventing the middle layer's bottom edge from peeking underneath.
    back.style.transform='translate3d(-50%,-50%,0) scale(1.035)';
    middle.style.transform=`translate3d(-50%,calc(-50% + ${-12-p*8}px),0) scale(1.035)`;
    front.style.transform=`translate3d(-50%,calc(-50% + ${58-p*36}px),0) scale(1.035)`;
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(render)};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  mq.addEventListener?.('change',()=>location.reload());
  render();
})();
