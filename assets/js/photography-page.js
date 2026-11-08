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

  const render = async () => {
    try {
      const collections = (await service.getCollections())
        .filter(collection => collection.showOnLanding && collection.slug);

      grid.replaceChildren();

      if (!collections.length) {
        grid.append(make('p', '', 'No collections published yet.'));
        return;
      }

      for (const collection of collections) {
        const card = make('article', 'photo-collection-card');
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
