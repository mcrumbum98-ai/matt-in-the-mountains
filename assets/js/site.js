(()=>{
 // Final Matt in the Mountains brand mark: one master vector everywhere, desktop + mobile.
 const logoUrl='assets/images/mountain-matt-logo.svg';
 const favicon=document.createElement('link');
 favicon.rel='icon'; favicon.type='image/svg+xml'; favicon.href=logoUrl;
 document.head.appendChild(favicon);
 const brandStyle=document.createElement('style');
 brandStyle.textContent=`.mm{width:64px!important;height:24px!important;display:inline-block!important;flex:0 0 auto!important;background:currentColor!important;-webkit-mask:url("${logoUrl}") center/contain no-repeat!important;mask:url("${logoUrl}") center/contain no-repeat!important}.mm svg,.mm b{display:none!important}.closing .mm{width:118px!important;height:34px!important;margin:0 auto 18px!important}@media(max-width:800px){.mm{width:54px!important;height:21px!important}.closing .mm{width:96px!important;height:29px!important}}`;
 document.head.appendChild(brandStyle);
})();

(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('main > section, .page-hero__copy, .article-head, .article-hero, .story-body > *, .photo-grid figure').forEach(el=>el.classList.add('reveal'));
 document.querySelectorAll('.reveal').forEach(el=>{if(reduce){el.classList.add('in');return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});io.observe(el)});

 if(reduce)return;
 const parallax=document.querySelectorAll('[data-parallax], [data-drift]');
 const sideways=document.querySelectorAll('[data-sideways]');
 const planes=document.querySelectorAll('[data-depth]');
 let ticking=false;
 const frame=()=>{
   parallax.forEach(el=>{const host=el.parentElement,r=host.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const speed=parseFloat(el.dataset.parallax||el.dataset.drift||'.04');const center=r.top+r.height/2-innerHeight/2;el.style.transform=`translate3d(0,${-center*speed}px,0) scale(1.07)`});
   sideways.forEach(el=>{const r=el.parentElement.getBoundingClientRect();const p=(innerHeight-r.top)/(innerHeight+r.height);el.style.transform=`translate3d(${(p-.5)*-24}vw,0,0)`});
   const y=Math.max(0,scrollY); planes.forEach(el=>{const d=parseFloat(el.dataset.depth||0);el.style.transform=`translate3d(0,${y*d}px,0) scale(${1+d*.08})`});
   ticking=false;
 };
 const request=()=>{if(!ticking){requestAnimationFrame(frame);ticking=true}};addEventListener('scroll',request,{passive:true});addEventListener('resize',request);request();
})();

// Concept 14: scroll-driven camera choreography and a hand-drawn botanical thread.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const story=document.querySelector('.camera-story'), stage=document.querySelector('.camera-stage');
 const vineWrap=document.querySelector('.journal-thread'), vinePaths=[...document.querySelectorAll('.vine path')];
 if(!story && !vineWrap) return;
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const lerp=(a,b,t)=>a+(b-a)*t;
 const ease=t=>1-Math.pow(1-clamp(t),3);
 const render=()=>{
  if(story && !reduce){
   const r=story.getBoundingClientRect(), travel=Math.max(1,story.offsetHeight-innerHeight), p=clamp(-r.top/travel);
   const f1=stage.querySelector('.camera-frame--one'), f2=stage.querySelector('.camera-frame--two'), f3=stage.querySelector('.camera-frame--three');
   const spans=[...stage.querySelectorAll('.camera-copy span')];
   const p1=ease(clamp(p/0.42)), p2=ease(clamp((p-.25)/.45)), p3=ease(clamp((p-.58)/.42));
   f1.style.transform=`translate3d(${lerp(0,-22,p1)}vw,${lerp(0,-8,p1)}vh,${lerp(0,230,p1)}px) rotate(${lerp(0,-4,p1)}deg) scale(${lerp(1,1.28,p1)})`;
   f1.style.opacity=String(1-clamp((p-.43)/.28));
   f2.style.opacity=String(clamp((p-.18)/.18)*(1-clamp((p-.68)/.22)));
   f2.style.transform=`translate3d(${lerp(12,-12,p2)}vw,${lerp(8,-5,p2)}vh,${lerp(-220,170,p2)}px) rotate(${lerp(6,-3,p2)}deg) scale(${lerp(.82,1.1,p2)})`;
   f3.style.opacity=String(clamp((p-.52)/.18));
   f3.style.transform=`translate3d(${lerp(0,-9,p3)}vw,${lerp(14,-2,p3)}vh,${lerp(-280,120,p3)}px) rotate(${lerp(-4,2,p3)}deg) scale(${lerp(.8,1.08,p3)})`;
   spans.forEach((el,i)=>{const q=clamp((p-(.08+i*.25))/.16);el.style.opacity=String(q);el.style.transform=`translateY(${lerp(30,0,ease(q))}px)`});
  }
  if(vineWrap){
   const r=vineWrap.getBoundingClientRect(), total=Math.max(1,r.height-innerHeight*.35), p=reduce?1:clamp((innerHeight*.7-r.top)/total);
   vinePaths.forEach((path,i)=>{const start=i===0?0:.12+i*.105; const q=i===0?p:clamp((p-start)/.16); path.style.strokeDashoffset=String(1-q)});
  }
 };
 let raf=0; const tick=()=>{raf=0;render()}; const req=()=>{if(!raf)raf=requestAnimationFrame(tick)};
 addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render();
})();

// Concept 15: a full photographic scroll exhibition; no image cropping or source edits.
(()=>{
 const stage=document.querySelector('.photo-camera__stage'), section=document.querySelector('.photo-camera');
 if(!stage||!section)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)), ease=t=>1-Math.pow(1-clamp(t),3), lerp=(a,b,t)=>a+(b-a)*t;
 const frames=['.ex-a','.ex-b','.ex-c','.ex-d','.ex-e'].map(q=>stage.querySelector(q)); const words=[...stage.querySelectorAll('.exhibit-words span')], bar=stage.querySelector('.exhibit-progress i');
 const render=()=>{const r=section.getBoundingClientRect(), travel=Math.max(1,section.offsetHeight-innerHeight), p=reduce?1:clamp(-r.top/travel); bar.style.width=`${p*100}%`;
  const windows=[[0,.24],[.15,.43],[.35,.63],[.55,.82],[.74,1]];
  frames.forEach((f,i)=>{const [a,b]=windows[i], q=ease(clamp((p-a)/(b-a))), enter=clamp((p-a)/.09), exit=i===4?0:clamp((p-(b-.07))/.07); f.style.opacity=String(enter*(1-exit)); const x=[0,15,-13,10,-5][i], rot=[-2,4,-3,2,-1][i]; f.style.transform=`translate3d(${lerp(x,-x*.65,q)}vw,${lerp(10,-7,q)}vh,${lerp(-260,180,q)}px) rotate(${lerp(rot,-rot*.5,q)}deg) scale(${lerp(.84,1.08,q)})`;});
  words.forEach((w,i)=>{const q=ease(clamp((p-(.08+i*.30))/.10));w.style.opacity=String(q);w.style.transform=`translateY(${lerp(28,0,q)}px)`});
 };
 let raf=0; const req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})}; addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render();
})();

// Concept 15: grow branches first, then unfurl leaves, while the main stem tracks scroll.
(()=>{
 const wrap=document.querySelector('.journal-thread--legacy'), stem=null, groups=[]; if(!wrap||!stem)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const render=()=>{const r=wrap.getBoundingClientRect(), total=Math.max(1,r.height-innerHeight*.35), p=reduce?1:clamp((innerHeight*.72-r.top)/total); stem.style.strokeDashoffset=String(1-p);
  groups.forEach(g=>{const at=parseFloat(g.dataset.grow||0), branch=g.querySelector('.vine-branch'), leaf=g.querySelector('.vine-leaf'); const b=clamp((p-at)/.08), l=clamp((p-at-.055)/.08); branch.style.strokeDashoffset=String(1-b); leaf.style.strokeDashoffset=String(1-l); leaf.style.opacity=String(l); leaf.style.transform=`scale(${.05+.95*l}) rotate(${(1-l)*-12}deg)`;});};
 let raf=0;const req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})};addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render();
})();

// Concept 16: synchronize each botanical node to the actual stem tip: stem -> branch -> Monstera unfurl.
(()=>{
 const wrap=document.querySelector('.journal-thread--mapped'), stem=wrap?.querySelector('.vine-stem'), groups=wrap?[...wrap.querySelectorAll('.vine-growth')]:[];
 if(!wrap||!stem)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)), ease=t=>1-Math.pow(1-clamp(t),3);
 const render=()=>{
   const r=wrap.getBoundingClientRect(), total=Math.max(1,wrap.offsetHeight-innerHeight*.28), p=reduce?1:clamp((innerHeight*.76-r.top)/total);
   stem.style.strokeDashoffset=String(1-p);
   groups.forEach(g=>{
     const at=parseFloat(g.dataset.grow||0), branch=g.querySelector('.vine-branch'), leaf=g.querySelector('.monstera');
     const branchP=ease(clamp((p-at)/.060));
     const leafP=ease(clamp((p-(at+.082))/.095));
     if(branch) branch.style.strokeDashoffset=String(1-branchP);
     if(leaf){
       leaf.style.opacity=String(leafP);
       const base=leaf.dataset.baseTransform || leaf.getAttribute('transform') || ''; leaf.dataset.baseTransform=base;
       leaf.setAttribute('transform', `${base} scale(${0.06+0.94*leafP}) rotate(${(1-leafP)*-10})`);
     }
   });
 };
 let raf=0; const req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})};
 addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render();
})();

// Concept 20: quiet botanical signature at Basecamp's lower edge.
(()=>{const wrap=document.querySelector('.home-botanical'),stem=wrap?.querySelector('.home-vine-stem'),leaves=wrap?[...wrap.querySelectorAll('.home-leaf')]:[];if(!wrap||!stem)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),ease=t=>1-Math.pow(1-clamp(t),3);const render=()=>{const r=wrap.getBoundingClientRect(),p=reduce?1:clamp((innerHeight*.82-r.top)/(r.height*.82));stem.style.strokeDashoffset=String(1-p);leaves.forEach(l=>{const at=parseFloat(l.dataset.at||0),q=ease(clamp((p-at)/.18));l.style.opacity=String(q);l.style.scale=String(.08+.92*q);l.style.rotate=`${(1-q)*-8}deg`;});};let raf=0;const req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})};addEventListener('scroll',req,{passive:true});addEventListener('resize',req);render()})();

// Prototype contact delivery: prepare the message in the visitor's mail client. Production swaps this for a server mail endpoint.
(()=>{const form=document.querySelector('#contactForm');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form),name=d.get('name'),email=d.get('email'),subject=d.get('subject'),message=d.get('message');const body=`From: ${name} <${email}>\n\n${message}`;location.href=`mailto:?subject=${encodeURIComponent('[Matt in the Mountains] '+subject)}&body=${encodeURIComponent(body)}`;const status=form.querySelector('.form-status');if(status)status.textContent='Your email app should open with the message prepared.';});})();

// Concept 25: Firewatch-style entrance — registered layers, locked Tetons, protected overlap.
(()=>{
 const hero=document.querySelector('.home-hero');
 const back=document.querySelector('.hero-parallax__back');
 const middle=document.querySelector('.hero-parallax__middle');
 const front=document.querySelector('.hero-parallax__front');
 if(!hero||!back||!middle||!front) return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let raf=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const render=()=>{
   raf=0;
   // Mobile has its own calibrated controller in mobile.js. Keeping this desktop-only
   // prevents two scroll handlers from fighting over the same layer transforms.
   if(innerWidth<=800) return;
   const rect=hero.getBoundingClientRect();
   const scrollRange=Math.max(1,hero.offsetHeight-innerHeight);
   const progress=reduce?0:clamp((-rect.top)/scrollRange);
   const scale=1.015;
   const middleStart=-24;
   const middleTravel=52;
   const frontStart=70;
   const frontTravel=210;
   back.style.transform=`translate3d(-50%,-50%,0) scale(${scale})`;
   middle.style.transform=`translate3d(-50%,calc(-50% + ${middleStart - progress*middleTravel}px),0) scale(${scale})`;
   front.style.transform=`translate3d(-50%,calc(-50% + ${frontStart - progress*frontTravel}px),0) scale(${scale})`;
 };
 const request=()=>{if(!raf) raf=requestAnimationFrame(render)};
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
})();
