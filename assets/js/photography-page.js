(() => {
  const grid = document.getElementById('photo-collection-grid');
  const service = window.MITMContent?.photography;

  if (!grid || !service) return;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const dropdown = document.getElementById('photo-nav-collection-links');
  const toggle = document.querySelector('.photo-nav-toggle');
  const menu = document.querySelector('.photo-nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const render = async () => {
    try {
      const publishedCollections = (await service.getCollections())
        .filter(collection => collection.slug);

      if (dropdown) {
        dropdown.replaceChildren();
        for (const collection of publishedCollections) {
          const link = make('a', '', collection.title);
          link.href = `photo-collection.html?collection=${encodeURIComponent(collection.slug)}`;
          dropdown.append(link);
        }
      }

      const collections = publishedCollections
        .filter(collection => collection.showOnLanding);

      grid.replaceChildren();

      if (!collections.length) {
        grid.append(make('p', '', 'No collections published yet.'));
        return;
      }

      const allCard = make('a', 'photo-collection-card');
      allCard.href = 'photo-collection.html?collection=all-photos';

      const allCover = make('div', 'photo-collection-card__cover');
      const firstPhoto = collections
        .flatMap(collection => [
          collection.coverPhoto,
          ...collection.photographs
        ])
        .find(photo => photo?.image?.url);

      if (firstPhoto) {
        const img = document.createElement('img');
        img.src = firstPhoto.image.url;
        img.alt = firstPhoto.image.alt || 'All Photos';
        img.loading = 'lazy';
        allCover.append(img);
      }

      allCard.append(allCover);
      allCard.append(make('h3', 'photo-collection-card__title', 'All Photos'));
      allCard.append(make('p', 'photo-collection-card__description',
        'Explore the complete photography archive.'));
      grid.append(allCard);

      for (const collection of collections) {
        const card = make('a', 'photo-collection-card');
        card.href = `photo-collection.html?collection=${encodeURIComponent(collection.slug)}`;
        const cover = make('div', 'photo-collection-card__cover');

        if (collection.coverPhoto?.image?.url) {
          const img = document.createElement('img');
          img.src = collection.coverPhoto.image.url;
          img.alt = collection.coverPhoto.image.alt || collection.title;
          img.loading = 'lazy';
          cover.append(img);
        }

        card.append(cover);
        card.append(make('h3', 'photo-collection-card__title', collection.title));

        if (collection.description) {
          card.append(make('p', 'photo-collection-card__description', collection.description));
        }

        grid.append(card);
      }
    } catch (error) {
      console.error('Could not load Photography collections:', error);
      grid.replaceChildren(make('p', '', 'Collections could not be loaded.'));
    }
  };

  render();
})();
