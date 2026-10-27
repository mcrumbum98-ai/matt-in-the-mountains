(() => {
  const gearContent = window.MITMContent?.gear;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const focalPosition = (image) => image ? `${Math.round((image.focalX ?? .5)*100)}% ${Math.round((image.focalY ?? .5)*100)}%` : '50% 50%';
  const activitiesFor = (review) => Array.isArray(review.activities)&&review.activities.length ? review.activities : (review.activity?[review.activity]:[]);
  const reviewHref = (review) => review.slug ? `gear/reviews/${encodeURIComponent(review.slug)}/` : 'gear.html';
  const reviewTitle = (review) => review.title || review.productName || 'Untitled Gear Review';
  const reviewImage = (review) => review.heroImage?.url || 'assets/images/gear-bench.jpeg';
  const score = (review) => Number.isFinite(Number(review.overallRating)) ? Number(review.overallRating).toFixed(Number(review.overallRating)%1?1:0) : '—';
  if (!gearContent) {
    console.error('Gear content service is unavailable.');
    return;
  }

  gearContent.getReviews().then(result=>{
    if(!result.length)throw new Error('No published Gear Reviews found.');
    const cardGrid=document.querySelector('.reviews .card-grid');
    if(cardGrid)cardGrid.innerHTML=result.slice(0,3).map(review=>{const a=activitiesFor(review),k=[a[0],review.gearType].filter(Boolean).join(' / ')||'GEAR REVIEW';return `<a class="review-card" href="${reviewHref(review)}"><div class="review-card__img"><img src="${escapeHtml(reviewImage(review))}" alt="${escapeHtml(review.heroImage?.alt||review.productName||reviewTitle(review))}" style="object-position:${escapeHtml(focalPosition(review.heroImage))}"></div><div class="review-card__body"><span class="kicker">${escapeHtml(k.toUpperCase())}</span><h3>${escapeHtml(reviewTitle(review))}</h3><div class="review-meta"><span class="score">${escapeHtml(score(review))} <small>/ 10</small></span><span class="pill">Review</span></div></div></a>`}).join('');
    const gearList=document.querySelector('.gear-list');
    if(gearList)gearList.innerHTML=result.map(review=>{const a=activitiesFor(review),meta=[...a.slice(0,2),review.gearType,review.subtype].filter(Boolean).slice(0,3).join(' / ');return `<a class="gear-row" href="${reviewHref(review)}" data-activities="${escapeHtml(a.join('|').toLowerCase())}" data-type="${escapeHtml(String(review.gearType||'').toLowerCase())}"><img src="${escapeHtml(reviewImage(review))}" alt="" style="object-position:${escapeHtml(focalPosition(review.heroImage))}"><h3>${escapeHtml(review.productName||reviewTitle(review))}</h3><span>${escapeHtml(meta||'Gear Review')}</span><strong>${escapeHtml(score(review))}</strong></a>`}).join('');
    document.querySelector('.reviews .placeholder-note')?.remove();
  }).catch(error=>{console.error('Gear content connection failed:',error);const note=document.querySelector('.reviews .placeholder-note');if(note)note.textContent=`STAGING CONNECTION ERROR — ${error.message}`});
})();
