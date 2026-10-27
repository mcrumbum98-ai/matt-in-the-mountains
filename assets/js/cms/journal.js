(() => {
  const sanity = window.MITMCmsSanity;

  if (!sanity) {
    throw new Error('CMS adapter is unavailable.');
  }

  const getPosts = async () => {
    const raw = await sanity.query(`
      *[_type == "journalPost" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt,_createdAt) desc){
        _id,title,subtitle,category,activity,location,featured,publishedAt,_createdAt,
        "slug":slug.current,
        heroImage{alt,hotspot,crop,"url":asset->url}
      }
    `);

    return (raw || []).map(post => ({
      id: post._id || '',
      title: post.title || '',
      subtitle: post.subtitle || '',
      category: post.category || '',
      activity: post.activity || '',
      location: post.location || '',
      featured: Boolean(post.featured),
      publishedAt: post.publishedAt || post._createdAt || '',
      slug: post.slug || '',
      heroImage: post.heroImage ? {
        url: post.heroImage.url || '',
        alt: post.heroImage.alt || '',
        focalX: post.heroImage.hotspot?.x ?? 0.5,
        focalY: post.heroImage.hotspot?.y ?? 0.5
      } : null
    }));
  };

  const getLanding = async () => {
    const raw = await sanity.query(`
      *[_type == "journalLanding" && _id == "journalLanding"][0]{
        mastheadTitle,
        mastheadIntro,
        storiesTitle,
        storiesIntro
      }
    `);

    if (!raw) return null;

    return {
      mastheadTitle: raw.mastheadTitle || '',
      mastheadIntro: raw.mastheadIntro || '',
      storiesTitle: raw.storiesTitle || '',
      storiesIntro: raw.storiesIntro || ''
    };
  };

  window.MITMContent = window.MITMContent || {};
  window.MITMContent.journal = {
    getLanding,
    getPosts
  };
})();
