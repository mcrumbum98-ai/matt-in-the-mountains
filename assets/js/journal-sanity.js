(() => {
  const journalContent = window.MITMContent?.journal;

  const feed = document.querySelector('#journal-feed');
  if (!feed) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const focal = image => image
    ? `${Math.round((image.focalX ?? .5) * 100)}% ${Math.round((image.focalY ?? .5) * 100)}%`
    : '50% 50%';

  const href = post => post.slug
    ? `journal/posts/${encodeURIComponent(post.slug)}/`
    : 'journal.html';

  const dateFor = post => {
    const raw = post.publishedAt;
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

  const meta = (post, featured = false) =>
    `<div class="story-meta">${featured ? '<span class="featured-label">FEATURED STORY</span>' : ''}<span>${esc(labelFor(post))}</span>${dateFor(post) ? `<time>${esc(dateFor(post))}</time>` : ''}</div>`;

  const featuredSlide = (post, index) =>
    `<a class="editorial-lead story-panel story-panel--forest featured-deck__slide" href="${esc(href(post))}" data-featured-slide="${index}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="editorial-lead__media">${image(post,'.045')}</div>
      <div class="editorial-lead__copy">
        ${meta(post, true)}
        <h2>${esc(post.title || 'Untitled Story')}</h2>
        ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
        <span class="read-mark">Read story <i>↗</i></span>
      </div>
    </a>`;

  const leadCard = (posts, index = 0) =>
    `<div class="featured-deck reveal" data-featured-deck>
      <div class="featured-deck__viewport">
        <div class="featured-deck__track" style="transform:translate3d(-${index * 100}%,0,0)">
          ${posts.map((post, slideIndex) => featuredSlide(post, slideIndex)).join('')}
        </div>
      </div>
      ${posts.length > 1 ? `<div class="featured-deck__controls">
        <button type="button" class="featured-deck__button" data-featured-prev aria-label="Previous featured story">←</button>
        <span class="featured-deck__count"><b data-featured-current>${String(index + 1).padStart(2,'0')}</b> / ${String(posts.length).padStart(2,'0')}</span>
        <button type="button" class="featured-deck__button" data-featured-next aria-label="Next featured story">→</button>
      </div>` : ''}
    </div>`;

  const secondaryTone = index => {
    const tones = ['story-panel--sand', 'story-panel--walnut', 'story-panel--sage'];
    return tones[index % tones.length];
  };

  const smallCard = (post, index) =>
    `<a class="editorial-card story-panel ${secondaryTone(index)} reveal" href="${esc(href(post))}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="editorial-card__media magnetic-media">${image(post,'.04')}</div>
      <div class="editorial-card__copy">
        ${meta(post)}
        <h3>${esc(post.title || 'Untitled Story')}</h3>
        ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
      </div>
    </a>`;

  const wideCard = (post, index) =>
    `<a class="wide-story story-panel ${secondaryTone(index)} reveal" href="${esc(href(post))}" data-journal-category="${esc(post.category || '')}" data-journal-activity="${esc(post.activity || '')}">
      <div class="wide-story__media">${image(post,'.04')}</div>
      <div class="wide-story__copy">
        ${meta(post)}
        <h3>${esc(post.title || 'Untitled Story')}</h3>
        ${deckFor(post) ? `<p>${esc(deckFor(post))}</p>` : ''}
      </div>
    </a>`;

  let featuredDeck = [];
  let featuredIndex = 0;
  let featuredTimer = null;
  let currentPosts = [];

  const stopFeaturedTimer = () => {
    if (featuredTimer) {
      clearInterval(featuredTimer);
      featuredTimer = null;
    }
  };

  const renderFeedCards = posts => {
    let html = '';

    for (let i = 0; i < posts.length; i += 4) {
      const group = posts.slice(i, i + 4);

      if (group[0]) {
        if (group[1]) {
          html += `<div class="editorial-pair">${smallCard(group[0],i)}${smallCard(group[1],i + 1)}</div>`;
        } else {
          html += smallCard(group[0],i);
        }
      }

      if (group[2]) {
        html += `<div class="journal-horizontal journal-horizontal--image-left">${wideCard(group[2],i + 2)}</div>`;
      }

      if (group[3]) {
        html += `<div class="journal-horizontal journal-horizontal--image-right">${wideCard(group[3],i + 3)}</div>`;
      }
    }

    return html;
  };

  const paintFeaturedDeck = () => {
    const deck = feed.querySelector('[data-featured-deck]');
    if (!deck) return;

    const track = deck.querySelector('.featured-deck__track');
    const current = deck.querySelector('[data-featured-current]');

    if (track) {
      track.style.transform = `translate3d(-${featuredIndex * 100}%,0,0)`;
    }

    if (current) {
      current.textContent = String(featuredIndex + 1).padStart(2,'0');
    }
  };

  const advanceFeatured = direction => {
    if (featuredDeck.length < 2) return;

    featuredIndex =
      (featuredIndex + direction + featuredDeck.length) % featuredDeck.length;

    paintFeaturedDeck();
    startFeaturedTimer();
  };

  const startFeaturedTimer = () => {
    stopFeaturedTimer();

    if (
      featuredDeck.length < 2 ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    featuredTimer = setInterval(() => {
      featuredIndex = (featuredIndex + 1) % featuredDeck.length;
      paintFeaturedDeck();
    }, 9000);
  };

  const bindFeaturedDeck = () => {
    const deck = feed.querySelector('[data-featured-deck]');
    if (!deck) return;

    deck.querySelector('[data-featured-prev]')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      advanceFeatured(-1);
    });

    deck.querySelector('[data-featured-next]')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      advanceFeatured(1);
    });

    deck.addEventListener('mouseenter', stopFeaturedTimer);
    deck.addEventListener('mouseleave', startFeaturedTimer);
    deck.addEventListener('focusin', stopFeaturedTimer);
    deck.addEventListener('focusout', startFeaturedTimer);
  };

  const render = posts => {
    stopFeaturedTimer();
    currentPosts = posts;

    featuredDeck = posts.filter(post => post.featured).slice(0,4);

    if (!featuredDeck.length && posts[0]) {
      featuredDeck = [posts[0]];
    }

    if (featuredIndex >= featuredDeck.length) featuredIndex = 0;

    feed.innerHTML =
      leadCard(featuredDeck, featuredIndex) +
      renderFeedCards(posts);

    initDynamicMotion();
    bindFeaturedDeck();
    startFeaturedTimer();
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

  if (!journalContent) {
    feed.innerHTML = `<div class="journal-empty"><p>Journal stories are temporarily unavailable.</p></div>`;
    return;
  }

  journalContent.getPosts()
    .then(result => {
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
