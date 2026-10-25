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
  const focalPosition = (image) => image?.hotspot ? `${Math.round(image.hotspot.x*100)}% ${Math.round(image.hotspot.y*100)}%` : '50% 50%';
  const renderPortableText = (blocks=[]) => { const f=document.createDocumentFragment(); blocks.forEach(block=>{if(block?._type!=='block')return;const value=(block.children||[]).map(c=>c.text||'').join('');if(!value)return;const tag=['h2','h3'].includes(block.style)?block.style:'p';const el=document.createElement(tag);el.textContent=value;f.appendChild(el)});return f; };
  const replaceList = (selector,values) => { if(!Array.isArray(values)||!values.length)return;const list=document.querySelector(selector);if(!list)return;list.innerHTML='';values.forEach(value=>{const li=document.createElement('li');li.textContent=value;list.appendChild(li)}) };
  const escapeHtml = (value) => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
      galleryImages.forEach((img,index)=>{const button=document.createElement('button');button.type='button';button.className='product-gallery__thumb'+(index===0?' is-active':'');button.setAttribute('aria-label',`Show product photo ${index+1}`);const thumb=document.createElement('img');thumb.src=img.url;thumb.alt='';thumb.style.objectPosition=focalPosition(img);button.appendChild(thumb);button.addEventListener('click',()=>{hero.src=img.url;hero.alt=img.alt||result.productName||'Gear review photo';hero.style.objectPosition=focalPosition(img);thumbs.querySelectorAll('button').forEach(b=>b.classList.remove('is-active'));button.classList.add('is-active')});thumbs.appendChild(button)});
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
