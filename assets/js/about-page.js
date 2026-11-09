(() => {
  const content = window.MITMContent?.about;
  const root = document.querySelector('.about');

  // Hide prototype content until the CMS request finishes.
  if (root) root.style.visibility = 'hidden';

  const show = () => {
    if (root) root.style.visibility = '';
  };

  if (!content) {
    console.error('About CMS adapter is unavailable.');
    show();
    return;
  }

  const renderBlocks = blocks => {
    const fragment = document.createDocumentFragment();

    for (const block of blocks || []) {
      if (block._type !== 'block') continue;

      const tags = {
        normal: 'p',
        h2: 'h2',
        h3: 'h3',
        blockquote: 'blockquote'
      };

      const element = document.createElement(tags[block.style] || 'p');

      for (const child of block.children || []) {
        if (child._type !== 'span') continue;

        let node = document.createTextNode(child.text || '');

        for (const mark of child.marks || []) {
          const tag = mark === 'strong' ? 'strong'
                    : mark === 'em' ? 'em' : null;
          if (!tag) continue;

          const wrapper = document.createElement(tag);
          wrapper.appendChild(node);
          node = wrapper;
        }

        element.appendChild(node);
      }

      fragment.appendChild(element);
    }

    return fragment;
  };

  const render = async () => {
    try {
      const page = await content.getPage();
      if (!page) return;

      const heading = document.querySelector('.about-intro h1');
      const portrait = document.querySelector('.about-portrait img');
      const caption = document.querySelector('.about-portrait figcaption');
      const copy = document.querySelector('.about-copy');

      if (heading && page.heading?.trim()) {
        heading.textContent = page.heading.trim();
      }

      if (portrait && page.portrait?.url) {
        portrait.src = page.portrait.url;
        portrait.alt = page.portrait.alt || page.heading || 'Portrait';
      }

      if (caption && page.portraitCaption?.trim()) {
        caption.textContent = page.portraitCaption.trim();
      }

      if (copy) {
        const button = copy.querySelector('.button-link');
        const paragraphs = [...copy.querySelectorAll('p')];

        if (page.richIntroduction?.length) {
          const intro = paragraphs[0];
          if (intro) intro.replaceWith(renderBlocks(page.richIntroduction));
        } else if (page.introduction?.trim() && paragraphs[0]) {
          paragraphs[0].textContent = page.introduction.trim();
        }

        if (page.richIntroduction?.length || page.richBiography?.length || page.biography?.trim()) {
          paragraphs.slice(1).forEach(p => p.remove());

          if (page.richBiography?.length) {
            copy.insertBefore(renderBlocks(page.richBiography), button || null);
          } else if (!page.richIntroduction?.length && page.biography?.trim()) {
            page.biography.trim().split(/\n\s*\n/).filter(Boolean)
              .forEach(text => {
                const p = document.createElement('p');
                p.textContent = text.trim();
                copy.insertBefore(p, button || null);
              });
          }
        }
      }
    } catch (error) {
      console.error('Unable to load About page from Basecamp:', error);
    } finally {
      show();
    }
  };

  render();
})();
