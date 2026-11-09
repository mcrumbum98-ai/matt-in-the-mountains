(() => {
  const api = window.MITMContent?.photography;
  const title = document.getElementById('collection-gallery-title');
  const description = document.getElementById('collection-gallery-description');
  const grid = document.getElementById('collection-gallery-grid');
  const intro = document.getElementById('collection-gallery-intro');
  const reveal = () => {
    if (!intro) return;
    intro.style.transition = 'opacity .45s ease';
    intro.style.visibility = 'visible';
    requestAnimationFrame(() => {
      intro.style.opacity = '1';
    });
  };

  if (!api || !title || !description || !grid) return;

  const slug = new URLSearchParams(window.location.search).get('collection');

  const load = async () => {
    if (!slug) {
      title.textContent = 'Collection not found';
      description.textContent = 'No collection was specified.';
      reveal();
      return;
    }

    try {
      const collections = await api.getCollections();
      const collection = collections.find(item => item.slug === slug);

      if (!collection) {
        title.textContent = 'Collection not found';
        description.textContent = 'This collection may have been moved or unpublished.';
        reveal();
        return;
      }

      document.title = `${collection.title} — Matt in the Mountains`;
      title.textContent = collection.title;
      description.textContent = collection.description || '';
      reveal();
      grid.replaceChildren();

      const photographs = collection.photographs.filter(photo => photo.image?.url);

      if (!photographs.length) {
        const message = document.createElement('p');
        message.textContent = 'No photographs in this collection yet.';
        grid.appendChild(message);
        return;
      }

      photographs.forEach((photo, index) => {
        const figure = document.createElement('figure');
        figure.className = 'collection-gallery__photo';

        const img = document.createElement('img');
        img.src = photo.image.url;
        img.alt = photo.image.alt || photo.title || 'Photograph';
        img.loading = index < 3 ? 'eager' : 'lazy';

        const caption = document.createElement('figcaption');
        caption.textContent = photo.title || '';

        figure.append(img, caption);
        grid.appendChild(figure);
      });
    } catch (error) {
      console.error('Could not load photography collection:', error);
      title.textContent = 'Unable to load collection';
      description.textContent = 'Please try again in a moment.';
      reveal();
    }
  };


  // Fullscreen photograph viewer
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImage = lightbox?.querySelector('.photo-lightbox__image');
  const lightboxCaption = lightbox?.querySelector('.photo-lightbox__caption');
  const lightboxCounter = lightbox?.querySelector('.photo-lightbox__counter');
  const closeButton = lightbox?.querySelector('.photo-lightbox__close');
  const previousButton = lightbox?.querySelector('.photo-lightbox__previous');
  const nextButton = lightbox?.querySelector('.photo-lightbox__next');

  let activePhotos = [];
  let activeIndex = 0;
  let previousFocus = null;
  let previousOverflow = '';

  const showPhoto = () => {
    const photo = activePhotos[activeIndex];
    if (!photo || !lightboxImage) return;

    lightboxImage.src = photo.image.url;
    lightboxImage.alt = photo.image.alt || photo.title || 'Photograph';
    lightboxCaption.textContent = photo.title || '';
    lightboxCounter.textContent =
      `${String(activeIndex + 1).padStart(2, '0')} / ${String(activePhotos.length).padStart(2, '0')}`;
  };

  const openLightbox = (photos, index) => {
    if (!lightbox || !photos.length) return;

    activePhotos = photos;
    activeIndex = index;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    showPhoto();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.style.overflow = previousOverflow;
    lightboxImage.removeAttribute('src');
    previousFocus?.focus();
  };

  const navigateLightbox = direction => {
    if (!activePhotos.length) return;
    activeIndex = (activeIndex + direction + activePhotos.length) % activePhotos.length;
    showPhoto();
  };

  closeButton?.addEventListener('click', closeLightbox);
  previousButton?.addEventListener('click', () => navigateLightbox(-1));
  nextButton?.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', event => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') navigateLightbox(-1);
    if (event.key === 'ArrowRight') navigateLightbox(1);
  });

  // Connect gallery photographs to the viewer
  const originalLoad = load;
  const loadWithViewer = async () => {
    await originalLoad();

    const collections = await api.getCollections();
    const collection = collections.find(item => item.slug === slug);
    if (!collection) return;

    const photos = collection.photographs.filter(photo => photo.image?.url);
    const figures = grid.querySelectorAll('.collection-gallery__photo');

    figures.forEach((figure, index) => {
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', `View ${photos[index].title || 'photograph'} fullscreen`);

      figure.addEventListener('click', () => openLightbox(photos, index));
      figure.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(photos, index);
        }
      });
    });
  };

  loadWithViewer();
})();

