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

        // Basecamp is the source of truth for both text sections.
        // Remove any old static content while preserving optional buttons.
        [...copy.children].forEach(child => {
          if (child !== button) child.remove();
        });

        const introduction = document.createElement('div');
        introduction.className = 'about-introduction';

        if (page.richIntroduction?.length) {
          introduction.appendChild(renderBlocks(page.richIntroduction));
        } else if (page.introduction?.trim()) {
          const p = document.createElement('p');
          p.className = 'about-lede';
          p.textContent = page.introduction.trim();
          introduction.appendChild(p);
        }

        if (introduction.hasChildNodes()) {
          copy.insertBefore(introduction, button || null);
        }

        const biography = document.createElement('div');
        biography.className = 'about-biography';

        if (page.richBiography?.length) {
          biography.appendChild(renderBlocks(page.richBiography));
        } else if (page.biography?.trim()) {
          page.biography.trim().split(/\n\s*\n/).filter(Boolean)
            .forEach(text => {
              const p = document.createElement('p');
              p.textContent = text.trim();
              biography.appendChild(p);
            });
        }

        if (biography.hasChildNodes()) {
          copy.insertBefore(biography, button || null);
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
