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

  const uniquePhotos = photos => {
    const seen = new Set();
    return photos.filter(photo => {
      if (!photo?.image?.url) return false;
      const key = photo.id || photo.image.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const load = async () => {
    try {
      const collections = await api.getCollections();
      let photographs = [];

      if (slug === 'all-photos') {
        title.textContent = 'All Photos';
        description.textContent = 'Every photograph from my published collections.';
        photographs = uniquePhotos(
          collections.flatMap(collection => [
            collection.coverPhoto,
            ...collection.photographs
          ])
        );
      } else {
        const collection = collections.find(item => item.slug === slug);

        if (!collection) {
          title.textContent = 'Collection not found';
          description.textContent = 'This collection may have been moved or unpublished.';
          reveal();
          return;
        }

        title.textContent = collection.title;
        description.textContent = collection.description || '';
        photographs = uniquePhotos([
          collection.coverPhoto,
          ...collection.photographs
        ]);
      }

      document.title = `${title.textContent} — Matt in the Mountains`;
      reveal();
      grid.replaceChildren();

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
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label',
          `View ${photo.title || 'photograph'} fullscreen`);

        figure.addEventListener('click',
          () => openLightbox(photographs, index));

        figure.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLightbox(photographs, index);
          }
        });

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

  // Minimal is the default; Basecamp can enable the original desk.
  const setViewerStyle = style => {
    if (!lightbox) return;
    lightbox.classList.toggle('viewer-minimal', style !== 'desk');
  };

  setViewerStyle('minimal');

  if (typeof api.getLanding === 'function') {
    api.getLanding()
      .then(settings => setViewerStyle(settings?.galleryViewerStyle))
      .catch(error => {
        console.warn('Using default minimal gallery viewer:', error);
      });
  }

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

  load();

})();
