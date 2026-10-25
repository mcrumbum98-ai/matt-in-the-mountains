(() => {
  const projectId = 'azxzfjey';
  const dataset = 'production';
  const apiVersion = '2024-01-01';
  const query = `*[_type == "gearReview" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt,_createdAt) desc){
    _id,productName,title,subtitle,overallRating,activities,activity,gearType,subtype,publishedAt,_createdAt,
    "slug":slug.current,
    "brandName":brand->name,
    heroImage{alt,hotspot,crop,"url":asset->url}
  }`;
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const focalPosition = (image) => {
    if (image?.hotspot) return `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`;
    if (image?.crop) {
      const x = image.crop.left + (1 - image.crop.left - image.crop.right) / 2;
      const y = image.crop.top + (1 - image.crop.top - image.crop.bottom) / 2;
      return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    }
    return '50% 50%';
  };
  const activitiesFor = (review) => Array.isArray(review.activities) && review.activities.length ? review.activities : (review.activity ? [review.activity] : []);
  const reviewHref = (review) => review.slug ? `review.html?slug=${encodeURIComponent(review.slug)}` : 'review.html';
  const reviewTitle = (review) => review.title || review.productName || 'Untitled Gear Review';
  const reviewImage = (review) => review.heroImage?.url || 'assets/images/gear-bench.jpeg';
  const score = (review) => Number.isFinite(Number(review.overallRating)) ? Number(review.overallRating).toFixed(Number(review.overallRating) % 1 ? 1 : 0) : '—';

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
      return response.json();
    })
    .then(({result = []}) => {
      if (!result.length) throw new Error('No published Gear Reviews found in Sanity.');

      const latest = result.slice(0, 3);
      const cardGrid = document.querySelector('.reviews .card-grid');
      if (cardGrid) {
        cardGrid.innerHTML = latest.map((review) => {
          const activities = activitiesFor(review);
          const kicker = [activities[0], review.gearType].filter(Boolean).join(' / ') || 'GEAR REVIEW';
          return `<a class="review-card" href="${reviewHref(review)}">
            <div class="review-card__img"><img src="${escapeHtml(reviewImage(review))}" alt="${escapeHtml(review.heroImage?.alt || review.productName || reviewTitle(review))}" style="object-position:${escapeHtml(focalPosition(review.heroImage))}"></div>
            <div class="review-card__body"><span class="kicker">${escapeHtml(kicker.toUpperCase())}</span><h3>${escapeHtml(reviewTitle(review))}</h3><div class="review-meta"><span class="score">${escapeHtml(score(review))} <small>/ 10</small></span><span class="pill">Review</span></div></div>
          </a>`;
        }).join('');
      }

      const gearList = document.querySelector('.gear-list');
      if (gearList) {
        gearList.innerHTML = result.map((review) => {
          const activities = activitiesFor(review);
          const meta = [...activities.slice(0, 2), review.gearType, review.subtype].filter(Boolean).slice(0, 3).join(' / ');
          return `<a class="gear-row" href="${reviewHref(review)}" data-activities="${escapeHtml(activities.join('|').toLowerCase())}" data-type="${escapeHtml(String(review.gearType || '').toLowerCase())}">
            <img src="${escapeHtml(reviewImage(review))}" alt="" style="object-position:${escapeHtml(focalPosition(review.heroImage))}">
            <h3>${escapeHtml(review.productName || reviewTitle(review))}</h3>
            <span>${escapeHtml(meta || 'Gear Review')}</span>
            <strong>${escapeHtml(score(review))}</strong>
          </a>`;
        }).join('');
      }

      const note = document.querySelector('.reviews .placeholder-note');
      if (note) note.remove();

      document.documentElement.dataset.gearSanityLoaded = 'true';
    })
    .catch((error) => {
      console.error('Gear index staging connection failed:', error);
      const note = document.querySelector('.reviews .placeholder-note');
      if (note) note.textContent = `STAGING CONNECTION ERROR — ${error.message}`;
    });
})();
