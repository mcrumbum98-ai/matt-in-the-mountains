(() => {
  const journal = window.MITMContent?.journal;
  if (!journal) return;

  const mastheadTitle = document.querySelector('#journal-masthead-title');
  const mastheadIntro = document.querySelector('#journal-masthead-intro');
  const storiesTitle = document.querySelector('#journal-stories-title');
  const storiesIntro = document.querySelector('#journal-stories-intro');

  const formatEditorialTitle = value => {
    const text = String(value || '').trim();
    if (!text) return '';

    const words = text.split(/\s+/);
    if (words.length < 2) return text;

    const split = Math.ceil(words.length / 2);
    const first = words.slice(0, split).join(' ');
    const second = words.slice(split).join(' ');

    return `${first}<br><em>${second}</em>`;
  };

  const render = content => {
    if (!content) return;

    if (mastheadTitle) {
      mastheadTitle.innerHTML = formatEditorialTitle(content.mastheadTitle);
    }

    if (mastheadIntro) {
      mastheadIntro.textContent = content.mastheadIntro;
    }

    if (storiesTitle) {
      storiesTitle.innerHTML = formatEditorialTitle(content.storiesTitle);
    }

    if (storiesIntro) {
      storiesIntro.textContent = content.storiesIntro || '';
      storiesIntro.hidden = !content.storiesIntro;
    }
  };

  journal.getLanding()
    .then(render)
    .catch(error => {
      console.error('Journal landing content unavailable:', error);
    });
})();
