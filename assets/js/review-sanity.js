(() => {
  const projectId = 'azxzfjey';
  const dataset = 'production';
  const apiVersion = '2024-01-01';
  const query = `*[_type == "gearReview" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
    productName,title,subtitle,overallRating,verdict,activities,activity,gearType,subtype,pros,cons,body,
    howObtained,ownedTested,use,conditions,ratingBreakdown,publishedAt,updatedAt,
    "brandName": brand->name,
    heroImage{alt,hotspot,crop,"url":asset->url},
    productGallery[]{alt,hotspot,crop,"url":asset->url}
  }`;
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const text = (selector, value) => { const el=document.querySelector(selector); if(el && value!==undefined && value!==null && value!=='') el.textContent=value; };
  const focalPosition = (image) => {
    if (image?.hotspot) return `${Math.round(image.hotspot.x*100)}% ${Math.round(image.hotspot.y*100)}%`;
    if (image?.crop) {
      const x = image.crop.left + (1 - image.crop.left - image.crop.right) / 2;
      const y = image.crop.top + (1 - image.crop.top - image.crop.bottom) / 2;
      return `${Math.round(x*100)}% ${Math.round(y*100)}%`;
    }
    return '50% 50%';
  };
  const renderPortableText = (blocks=[]) => { const f=document.createDocumentFragment(); blocks.forEach(block=>{if(block?._type!=='block')return;const value=(block.children||[]).map(c=>c.text||'').join('');if(!value)return;const tag=['h2','h3'].includes(block.style)?block.style:'p';const el=document.createElement(tag);el.textContent=value;f.appendChild(el)});return f; };
  const replaceList = (selector,values) => { if(!Array.isArray(values)||!values.length)return;const list=document.querySelector(selector);if(!list)return;list.innerHTML='';values.forEach(value=>{const li=document.createElement('li');li.textContent=value;list.appendChild(li)}) };
  const escapeHtml = (value) => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* Staging-only presentation rules. These deliberately do not touch homepage CSS. */
  const style=document.createElement('style');
  style.textContent=`
    .review-hero-img{height:auto!important;aspect-ratio:16/9;background:#d7d0c4;position:relative}
    .review-hero-img>img{width:100%;height:100%;object-fit:cover;transition:opacity .18s ease;display:block}
    .product-gallery{margin:14px 0 0}
    .product-gallery__thumbs{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 10px;scrollbar-width:thin}
    .product-gallery__thumb{appearance:none;border:2px solid transparent;background:transparent;padding:0;width:92px;min-width:92px;aspect-ratio:4/3;overflow:hidden;cursor:pointer;opacity:.68;border-radius:5px;transition:opacity .18s ease,border-color .18s ease,transform .18s ease}
    .product-gallery__thumb:hover{opacity:1;transform:translateY(-1px)}
    .product-gallery__thumb.is-active{border-color:var(--forest);opacity:1}
    .product-gallery__thumb img{width:100%;height:100%;object-fit:cover;display:block}
    @media(max-width:800px){.review-hero-img{aspect-ratio:4/3}.product-gallery__thumb{width:76px;min-width:76px}}
  `;
  document.head.appendChild(style);

  fetch(endpoint).then(response=>{if(!response.ok)throw new Error(`Sanity returned ${response.status}`);return response.json()}).then(({result})=>{
    if(!result)throw new Error('No published Gear Review found in Sanity.');
    const activities = Array.isArray(result.activities)&&result.activities.length ? result.activities : (result.activity?[result.activity]:[]);
    document.title=`${result.productName||result.title} — Matt in the Mountains`;
    text('.review-title h1',result.title||result.productName);
    text('.review-title > div:first-child .serif',result.subtitle);
    text('.review-scorebox .score',result.overallRating!=null?`${result.overallRating} / 10`:null);
    text('.review-top .kicker',`GEAR REVIEW / ${(activities[0]||'GEAR').toUpperCase()}`);
    text('.verdict p',result.verdict);

    const hero=document.querySelector('.review-hero-img img');
    if(hero&&result.heroImage?.url){hero.src=result.heroImage.url;hero.alt=result.heroImage.alt||result.productName||'Gear review photo';hero.style.objectPosition=focalPosition(result.heroImage)}

    const galleryImages=[result.heroImage,...(Array.isArray(result.productGallery)?result.productGallery:[])].filter(img=>img?.url);
    const heroWrap=document.querySelector('.review-hero-img');
    if(heroWrap&&galleryImages.length>1){
      const gallery=document.createElement('div');gallery.className='product-gallery';
      gallery.innerHTML=`<div class="product-gallery__thumbs" aria-label="Product photos"></div>`;
      const thumbs=gallery.querySelector('.product-gallery__thumbs');
      const showImage=(img,button)=>{
        hero.style.opacity='.35';
        window.setTimeout(()=>{hero.src=img.url;hero.alt=img.alt||result.productName||'Gear review photo';hero.style.objectPosition=focalPosition(img);hero.style.opacity='1'},90);
        thumbs.querySelectorAll('button').forEach(b=>b.classList.remove('is-active'));
        button.classList.add('is-active');
      };
      galleryImages.forEach((img,index)=>{const button=document.createElement('button');button.type='button';button.className='product-gallery__thumb'+(index===0?' is-active':'');button.setAttribute('aria-label',`Show product photo ${index+1}`);const thumb=document.createElement('img');thumb.src=img.url;thumb.alt='';thumb.style.objectPosition=focalPosition(img);button.appendChild(thumb);button.addEventListener('click',()=>showImage(img,button));thumbs.appendChild(button)});
      heroWrap.insertAdjacentElement('afterend',gallery);
    }

    replaceList('.proscons > div:first-child ul',result.pros);replaceList('.proscons > div:last-child ul',result.cons);
    const copy=document.querySelector('.article-copy');const verdict=copy?.querySelector('.verdict');const prosCons=copy?.querySelector('.proscons');
    if(copy&&Array.isArray(result.body)){[...copy.children].forEach(child=>{if(child!==verdict&&child!==prosCons)child.remove()});copy.appendChild(renderPortableText(result.body))}
    const note=document.querySelector('.placeholder-note');if(note)note.remove();
    const details=document.querySelector('.sidebar-box dl');if(details){const rows=[['Owned / tested',result.ownedTested],['Use',result.use],['Conditions',result.conditions],['How obtained',result.howObtained],['Activities',activities.join(' · ')],['Type',[result.gearType,result.subtype].filter(Boolean).join(' / ')]].filter(([,v])=>v);details.innerHTML=rows.map(([l,v])=>`<dt>${escapeHtml(l)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}
    const bars=document.querySelector('.rating-bars');if(bars&&Array.isArray(result.ratingBreakdown)&&result.ratingBreakdown.length){bars.innerHTML='<div class="kicker">RATING BREAKDOWN</div>'+result.ratingBreakdown.map(item=>{const score=Number(item.score)||0;return `<div class="rating-line"><div><span>${escapeHtml(item.label)}</span><b>${score}</b></div><span class="bar"><i style="width:${Math.max(0,Math.min(100,score*10))}%"></i></span></div>`}).join('')}
    document.documentElement.dataset.sanityLoaded='true';
  }).catch(error=>{console.error('Basecamp staging connection failed:',error);const note=document.querySelector('.placeholder-note');if(note)note.textContent=`STAGING CONNECTION ERROR — ${error.message}`});
})();
