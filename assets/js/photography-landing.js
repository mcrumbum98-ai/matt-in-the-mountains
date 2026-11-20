(() => {
  const service = window.MITMContent?.photography;
  if (!service?.getLanding) return;

  const setText = (selector, value) => {
    if (typeof value !== 'string') return;
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const render = async () => {
    try {
      const page = await service.getLanding();
      if (!page) return;

      const heading = document.querySelector('.exhibit-intro h1');
      if (heading) {
        const firstLine = typeof page.introHeading === 'string'
          ? page.introHeading
          : 'Not a gallery.';
        const secondLine = typeof page.introEmphasis === 'string'
          ? page.introEmphasis
          : 'A way through.';

        heading.replaceChildren(
          document.createTextNode(firstLine),
          document.createElement('br')
        );

        const emphasis = document.createElement('em');
        emphasis.textContent = secondLine;
        heading.append(emphasis);
      }
      setText('.exhibit-intro .wrap > p:not(.kicker)', page.introDescription);

      const frames = [...document.querySelectorAll('.exhibit-frame')];

      (page.featuredPhotographs || []).slice(0, 5).forEach((item, index) => {
        const frame = frames[index];
        const photo = item?.photograph;
        if (!frame || !photo?.image?.url) return;

        const image = frame.querySelector('img');
        const caption = frame.querySelector('figcaption');

        if (image) {
          image.src = photo.image.url;
          image.alt = photo.image.alt || photo.title || '';
        }

        if (caption && typeof item.caption === 'string') {
          caption.textContent = item.caption;
        }
      });

      const statementLines = document.querySelectorAll('.exhibit-words span');

      (page.exhibitionStatement || []).slice(0, 3).forEach((line, index) => {
        if (statementLines[index] && typeof line === 'string') {
          statementLines[index].textContent = line;
        }
      });

      setText('.photo-outro h2', page.outroHeading);
      setText('.photo-outro .wrap > p:not(.kicker)', page.outroDescription);

    } catch (error) {
      console.error('Could not load Photography Landing:', error);
    } finally {
      document.body.classList.add('photography-content-ready');
    }
  };

  render();
})();
