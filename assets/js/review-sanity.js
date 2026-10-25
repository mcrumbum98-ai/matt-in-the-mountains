(() => {
  const projectId = 'azxzfjey';
  const dataset = 'production';
  const apiVersion = '2024-01-01';
  const query = `*[_type == "gearReview" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
    productName,
    title,
    subtitle,
    overallRating,
    verdict,
    activity,
    gearType,
    subtype,
    pros,
    cons,
    body,
    howObtained,
    ownedTested,
    use,
    conditions,
    ratingBreakdown,
    publishedAt,
    updatedAt,
    "brandName": brand->name,
    heroImage{alt,"url":asset->url}
  }`;

  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  const text = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && value !== undefined && value !== null && value !== '') el.textContent = value;
  };

  const renderPortableText = (blocks = []) => {
    const fragment = document.createDocumentFragment();
    blocks.forEach((block) => {
      if (block?._type !== 'block') return;
      const value = (block.children || []).map((child) => child.text || '').join('');
      if (!value) return;
      const tag = ['h2', 'h3'].includes(block.style) ? block.style : 'p';
      const el = document.createElement(tag);
      el.textContent = value;
      fragment.appendChild(el);
    });
    return fragment;
  };

  const replaceList = (selector, values) => {
    if (!Array.isArray(values) || !values.length) return;
    const list = document.querySelector(selector);
    if (!list) return;
    list.innerHTML = '';
    values.forEach((value) => {
      const li = document.createElement('li');
      li.textContent = value;
      list.appendChild(li);
    });
  };

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
      return response.json();
    })
    .then(({result}) => {
      if (!result) throw new Error('No published Gear Review found in Sanity.');

      document.title = `${result.productName || result.title} — Matt in the Mountains`;
      text('.review-title h1', result.title || result.productName);
      text('.review-title > div:first-child .serif', result.subtitle);
      text('.review-scorebox .score', result.overallRating != null ? `${result.overallRating} / 10` : null);
      text('.review-top .kicker', `GEAR REVIEW / ${(result.activity || 'GEAR').toUpperCase()}`);
      text('.verdict p', result.verdict);

      const hero = document.querySelector('.review-hero-img img');
      if (hero && result.heroImage?.url) {
        hero.src = result.heroImage.url;
        hero.alt = result.heroImage.alt || result.productName || 'Gear review photo';
      }

      replaceList('.proscons > div:first-child ul', result.pros);
      replaceList('.proscons > div:last-child ul', result.cons);

      const copy = document.querySelector('.article-copy');
      const verdict = copy?.querySelector('.verdict');
      const prosCons = copy?.querySelector('.proscons');
      if (copy && Array.isArray(result.body)) {
        [...copy.children].forEach((child) => {
          if (child !== verdict && child !== prosCons) child.remove();
        });
        copy.appendChild(renderPortableText(result.body));
      }

      const note = document.querySelector('.placeholder-note');
      if (note) {
        note.textContent = `STAGING / SANITY TEST — ${result.brandName || 'Unknown brand'} · ${result.productName || 'Gear review'}`;
      }

      const details = document.querySelector('.sidebar-box dl');
      if (details) {
        const rows = [
          ['Owned / tested', result.ownedTested],
          ['Use', result.use],
          ['Conditions', result.conditions],
          ['How obtained', result.howObtained],
          ['Type', [result.gearType, result.subtype].filter(Boolean).join(' / ')],
        ].filter(([, value]) => value);
        details.innerHTML = rows.map(([label, value]) => `<dt>${label}</dt><dd>${String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</dd>`).join('');
      }

      const bars = document.querySelector('.rating-bars');
      if (bars && Array.isArray(result.ratingBreakdown) && result.ratingBreakdown.length) {
        bars.innerHTML = '<div class="kicker">RATING BREAKDOWN</div>' + result.ratingBreakdown.map((item) => {
          const label = String(item.label || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
          const score = Number(item.score) || 0;
          return `<div class="rating-line"><div><span>${label}</span><b>${score}</b></div><span class="bar"><i style="width:${Math.max(0, Math.min(100, score * 10))}%"></i></span></div>`;
        }).join('');
      }

      document.documentElement.dataset.sanityLoaded = 'true';
    })
    .catch((error) => {
      console.error('Basecamp staging connection failed:', error);
      const note = document.querySelector('.placeholder-note');
      if (note) note.textContent = `STAGING CONNECTION ERROR — ${error.message}`;
    });
})();
