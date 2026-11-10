(() => {
  const nav = document.querySelector('.site-header .navlinks');
  if (!nav) return;

  const photographyLink = [...nav.querySelectorAll('a')]
    .find(link => {
      const href = link.getAttribute('href');
      if (!href) return false;
      try {
        return new URL(href, document.baseURI).pathname.endsWith('/photography.html');
      } catch {
        return false;
      }
    });

  if (!photographyLink) return;

  let menu = photographyLink.closest('.photo-nav-menu');

  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'photo-nav-menu';

    photographyLink.before(menu);
    menu.append(photographyLink);
  }

  let toggle = menu.querySelector('.photo-nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'photo-nav-toggle';
    toggle.type = 'button';
    toggle.textContent = '⌄';
    toggle.setAttribute('aria-label', 'Show Photography collections');
    menu.append(toggle);
  }

  let dropdown = menu.querySelector('.photo-nav-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'photo-nav-dropdown';
    dropdown.id = 'photo-nav-dropdown';
    menu.append(dropdown);
  }

  toggle.setAttribute('aria-controls', dropdown.id);
  toggle.setAttribute('aria-expanded', 'false');

  dropdown.replaceChildren();

  const addLink = (label, href, parent = dropdown) => {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    parent.append(link);
  };

  addLink('Photography Home', 'photography.html');
  addLink('All Photos', 'photo-collection.html?collection=all-photos');

  const collectionLinks = document.createElement('div');
  dropdown.append(collectionLinks);

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  // Replace any previously attached toggle with a fresh one.
  const freshToggle = toggle.cloneNode(true);
  toggle.replaceWith(freshToggle);

  freshToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    freshToggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) close();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });

  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const loadCollections = async () => {
    try {
      if (!window.MITMContent?.photography) {
        if (!window.MITMContent?.sanity) {
          await loadScript('assets/js/cms/sanity.js');
        }
        await loadScript('assets/js/cms/photography.js');
      }

      const service = window.MITMContent?.photography;
      if (!service) return;

      const collections = await service.getCollections();

      collectionLinks.replaceChildren();

      for (const collection of collections) {
        if (!collection.slug) continue;

        addLink(
          collection.title,
          `photo-collection.html?collection=${encodeURIComponent(collection.slug)}`,
          collectionLinks
        );
      }
    } catch (error) {
      console.error('Photography navigation could not load collections:', error);
    }
  };

  loadCollections();
})();
