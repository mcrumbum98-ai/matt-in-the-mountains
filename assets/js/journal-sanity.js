(() => {
  const projectId = 'azxzfjey';
  const dataset = 'production';
  const apiVersion = '2024-01-01';

  const query = `*[_type == "journalPost" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt,_createdAt) desc){
    _id,title,subtitle,category,activity,location,featured,publishedAt,_createdAt,
    "slug":slug.current,
    heroImage{alt,hotspot,crop,"url":asset->url}
  }`;

  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const feed = document.querySelector('#journal-feed');
  if (!feed) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const focal = image => image?.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : '50% 50%';

  const href = post => post.slug
    ? `journal/posts/${encodeURIComponent(post.slug)}/`
    : 'journal.html';

  const dateFor = post => {
    const raw = post.publishedAt || post._createdAt;
    if (!raw) return '';
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', {
      month:'long', day:'numeric', year:'numeric'
    });
  };

  const labelFor = post => {
    if (post.category === 'Projects & DIY') return 'Projects + DIY';
    if (post.category === 'Tips & Skills') return 'Tips';
    return post.activity || post.category || 'Journal';
  };

  const imageFor = post => post.heroImage?.url || 'assets/images/trail.jpeg';
  const deckFor = post => post.subtitle || '';

  const image = (post, drift) =>
    `<img data-drift="${drift}" src="${esc(imageFor(post))}" alt="${esc(post.heroImage?.alt || post.title || '')}" style="object-position:${esc(focal(post.heroImage))}">`;

  const meta = post =>
    `<div class="story-meta"><span>${esc(labelFor(post))}</span>${dateFor(post) ? `<time>${esc(dateFor(post))}</time>` : ''}</div>`;

  const leadCard = post =>
    `<a class="editorial-lead story-panel story-panel--forest reveal" href="${esc(href(post))}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="editorial-lead__media magnetic-media">${image(post,'.045')}</div>
      <div class="editorial-lead__copy">
        ${meta(post)}
        <h2>${esc(post.title || 'Untitled Story')}</h2>
        ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
        <span class="read-mark">Read story <i>↗</i></span>
      </div>
    </a>`;

  const smallCard = (post, index) => {
    const walnut = index % 2 === 1;
    return `<a class="editorial-card story-panel ${walnut ? 'story-panel--walnut offset' : 'story-panel--sand tall'} reveal" href="${esc(href(post))}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="editorial-card__media magnetic-media">${image(post, walnut ? '.055' : '.035')}</div>
      ${meta(post)}
      <h3>${esc(post.title || 'Untitled Story')}</h3>
      ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
    </a>`;
  };

  const wideCard = post =>
    `<a class="wide-story story-panel story-panel--sage reveal" href="${esc(href(post))}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="wide-story__media">${image(post,'.04')}</div>
      <div class="wide-story__copy">
        ${meta(post)}
        <h3>${esc(post.title || 'Untitled Story')}</h3>
        ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
      </div>
    </a>`;

  const render = posts => {
    const featured = posts.filter(post => post.featured);
    const lead = featured[0] || posts[0];
    const remaining = posts.filter(post => post._id !== lead._id);

    let html = leadCard(lead);

    for (let i = 0; i < remaining.length; i += 3) {
      const group = remaining.slice(i, i + 3);

      if (group.length >= 1) {
        if (group.length === 1) {
          html += wideCard(group[0]);
        } else {
          html += `<div class="editorial-pair">${smallCard(group[0],0)}${smallCard(group[1],1)}</div>`;
          if (group[2]) html += wideCard(group[2]);
        }
      }
    }

    feed.innerHTML = html;
    initDynamicMotion();
  };

  let driftCleanup = null;

  const initDynamicMotion = () => {
    if (driftCleanup) {
      driftCleanup();
      driftCleanup = null;
    }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = feed.querySelectorAll('.reveal');

    if (reduce) {
      reveals.forEach(el => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12});

    reveals.forEach(el => io.observe(el));

    const drifts = [...feed.querySelectorAll('[data-drift]')];
    let ticking = false;

    const frame = () => {
      drifts.forEach(el => {
        const host = el.parentElement;
        const r = host.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const speed = parseFloat(el.dataset.drift || '.04');
        const center = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = `translate3d(0,${-center * speed}px,0) scale(1.07)`;
      });
      ticking = false;
    };

    const request = () => {
      if (!ticking) {
        requestAnimationFrame(frame);
        ticking = true;
      }
    };

    addEventListener('scroll', request, {passive:true});
    addEventListener('resize', request);
    driftCleanup = () => {
      removeEventListener('scroll', request);
      removeEventListener('resize', request);
    };
    request();
  };

  const filters = [...document.querySelectorAll('.journal-filter a')];

  const matchesFilter = (post, label) => {
    if (label === 'All') return true;
    if (label === 'Skiing') return post.activity === 'Skiing / Touring';
    if (label === 'Hiking') return post.activity === 'Hiking';
    if (label === 'Climbing') return post.activity === 'Climbing';
    if (label === 'Camping') return post.activity === 'Camping';
    if (label === 'Paddling') return post.activity === 'Paddling';
    if (label === 'Projects + DIY') return post.category === 'Projects & DIY';
    if (label === 'Tips') return post.category === 'Tips & Skills';
    return true;
  };

  fetch(endpoint)
    .then(response => {
      if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
      return response.json();
    })
    .then(({result = []}) => {
      if (!result.length) throw new Error('No published Journal posts found in Sanity.');

      render(result);

      filters.forEach(filter => {
        filter.addEventListener('click', event => {
          event.preventDefault();

          filters.forEach(item => item.classList.remove('active'));
          filter.classList.add('active');

          const label = filter.textContent.trim();
          const filtered = result.filter(post => matchesFilter(post, label));

          if (filtered.length) {
            render(filtered);
          } else {
            feed.innerHTML = `<div class="journal-empty"><p>No ${esc(label)} stories yet.</p></div>`;
          }

          document.querySelector('#stories')?.scrollIntoView({behavior:'smooth', block:'start'});
        });
      });
    })
    .catch(error => {
      console.error('Journal index staging connection failed:', error);
      feed.innerHTML = `<div class="journal-empty"><p>Journal stories are temporarily unavailable.</p></div>`;
    });
})();
