(() => {
  const cards = [...document.querySelectorAll('.home-latest .latest-card')];
  const journal = window.MITMContent?.journal;

  if (!cards.length || !journal) return;

  const formatDate = value => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const categoryFor = post => {
    if (post.category === 'Projects & DIY') return 'Projects + DIY';
    if (post.category === 'Tips & Skills') return 'Tips';
    return post.activity || post.category || 'Journal';
  };

  journal.getPosts()
    .then(posts => {
      const latest = posts.filter(post => post.slug && post.title).slice(0, 4);

      latest.forEach((post, index) => {
        const card = cards[index];

        card.href = `journal/posts/${encodeURIComponent(post.slug)}/`;

        const title = card.querySelector('h3');
        if (title) title.textContent = post.title;

        const meta = card.querySelector('.story-meta');
        if (meta) {
          const category = meta.querySelector('span');
          if (category) category.textContent = categoryFor(post);

          const date = formatDate(post.publishedAt);
          const existingText = [...meta.childNodes]
            .filter(node => node.nodeType === Node.TEXT_NODE);

          existingText.forEach(node => node.remove());

          if (date) meta.append(document.createTextNode(` ${date}`));
        }

        const image = card.querySelector('.latest-media img');
        if (image && post.heroImage?.url) {
          image.src = post.heroImage.url;
          image.alt = post.heroImage.alt || post.title;
          image.style.objectPosition =
            `${Math.round((post.heroImage.focalX ?? 0.5) * 100)}% ` +
            `${Math.round((post.heroImage.focalY ?? 0.5) * 100)}%`;
        }
      });

      cards.slice(latest.length).forEach(card => {
        card.style.display = 'none';
      });
    })
    .catch(error => {
      console.error('Homepage Journal loading failed:', error);
    });
})();
