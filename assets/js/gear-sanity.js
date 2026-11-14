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
    if(cardGrid)cardGrid.innerHTML=result.slice(0,3).map(review=>{const a=activitiesFor(review),k=[a[0],review.gearType].filter(Boolean).join(' / ')||'GEAR REVIEW';return `<a class="review-card" href="${reviewHref(review)}"><div class="review-card__img"><img src="${escapeHtml(reviewImage(review))}" alt="${escapeHtml(review.heroImage?.alt||review.productName||reviewTitle(review))}" style="object-position:${escapeHtml(focalPosition(review.heroImage))}"></div><div class="review-card__body"><span class="kicker">${escapeHtml(k.toUpperCase())}</span><h3>${escapeHtml(review.productName||reviewTitle(review))}</h3>${review.title && review.title !== review.productName ? `<p class="review-card__subtitle">${escapeHtml(review.title)}</p>` : ""}<div class="review-meta"><span class="score">${escapeHtml(score(review))} <small>/ 10</small></span><span class="pill">Review</span></div></div></a>`}).join('');
    const gearList=document.querySelector('.gear-list');
    if(gearList)gearList.innerHTML=result.map(review=>{const a=activitiesFor(review),meta=[...a.slice(0,2),review.gearType,review.subtype].filter(Boolean).slice(0,3).join(' / ');return `<a class="gear-row" href="${reviewHref(review)}" data-activities="${escapeHtml(a.join('|').toLowerCase())}" data-type="${escapeHtml(String(review.gearType||'').toLowerCase())}"><img src="${escapeHtml(reviewImage(review))}" alt="" style="object-position:${escapeHtml(focalPosition(review.heroImage))}"><h3>${escapeHtml(review.productName||reviewTitle(review))}</h3><span>${escapeHtml(meta||'Gear Review')}</span><strong>${escapeHtml(score(review))}</strong></a>`}).join('');

    // Gear Library filters and activity-card navigation.
    const filterButtons = [...document.querySelectorAll('.filterbar button')];
    const activityCards = [...document.querySelectorAll('.categories .cat')];

    const categoryTerms = {
      'Hike & Camp': ['hik', 'camp', 'backpack'],
      'Ski': ['ski', 'tour', 'snowboard'],
      'Paddle': ['paddl', 'kayak', 'canoe', 'sup'],
      'Climb': ['climb', 'boulder', 'mountaineer'],
      'Run': ['run', 'running'],
      'Apparel': ['apparel', 'clothing', 'jacket', 'pants', 'layer'],
      'Essentials': ['essential', 'accessor', 'dog gear', 'gadget', 'tool']
    };

    const matchesCategory = (review, category) => {
      if (category === 'All') return true;

      const searchable = [
        ...activitiesFor(review),
        review.gearType,
        review.subtype
      ].filter(Boolean).join(' ').toLowerCase();

      return (categoryTerms[category] || []).some(term =>
        searchable.includes(term)
      );
    };

    const applyFilter = category => {
      if (!gearList) return;

      filterButtons.forEach(button => {
        button.classList.toggle(
          'active',
          button.textContent.trim() === category
        );
      });

      const rows = [...gearList.querySelectorAll('.gear-row')];
      let visible = 0;

      rows.forEach((row, index) => {
        const matches = matchesCategory(result[index], category);
        row.style.display = matches ? '' : 'none';
        if (matches) visible++;
      });

      gearList.querySelector('.gear-filter-empty')?.remove();

      if (!visible) {
        const message = document.createElement('p');
        message.className = 'gear-filter-empty';
        message.textContent = `No ${category} reviews yet.`;
        message.style.padding = '24px 0';
        gearList.appendChild(message);
      }
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        applyFilter(button.textContent.trim());
      });
    });

    const cardCategories = [
      'Hike & Camp', 'Ski', 'Paddle',
      'Climb', 'Run', 'Essentials'
    ];

    activityCards.forEach((card, index) => {
      card.addEventListener('click', event => {
        event.preventDefault();

        const category = cardCategories[index];
        applyFilter(category);

        document.querySelector('#all')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });

    applyFilter('All');

    document.querySelector('.reviews .placeholder-note')?.remove();
  }).catch(error=>{console.error('Gear content connection failed:',error);const note=document.querySelector('.reviews .placeholder-note');if(note)note.textContent=`STAGING CONNECTION ERROR — ${error.message}`})
    .finally(()=>{
      window.MITMCmsPage?.ready();
    });
})();
