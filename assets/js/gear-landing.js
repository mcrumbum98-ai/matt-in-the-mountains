(() => {
  const gear = window.MITMContent?.gear;
  if (!gear) return;

  const fields = {
    heroKicker: '#gear-hero-kicker',
    heroTitle: '#gear-hero-title',
    heroIntro: '#gear-hero-intro',
    introCopy: '#gear-intro-copy',
    categoriesKicker: '#gear-categories-kicker',
    categoriesTitle: '#gear-categories-title',
    reviewsKicker: '#gear-reviews-kicker',
    reviewsTitle: '#gear-reviews-title',
    libraryKicker: '#gear-library-kicker',
    libraryTitle: '#gear-library-title'
  };

  const render = content => {
    if (!content) return;

    Object.entries(fields).forEach(([field, selector]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = content[field] || '';
    });

    const introTitle = document.querySelector('#gear-intro-title');
    if (introTitle) {
      const text = String(content.introTitle || '').trim();
      const words = text.split(/\s+/);

      if (words.length >= 2) {
        const split = Math.ceil(words.length / 2);
        const first = words.slice(0, split).join(' ');
        const second = words.slice(split).join(' ');
        introTitle.innerHTML = `${first}<br><em>${second}</em>`;
      } else {
        introTitle.textContent = text;
      }
    }
  };

  gear.getLanding()
    .then(render)
    .catch(error => {
      console.error('Gear landing content unavailable:', error);
    });
})();
