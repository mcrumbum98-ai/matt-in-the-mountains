(() => {
  const sanity = window.MITMCmsSanity;

  if (!sanity) {
    throw new Error('CMS adapter is unavailable.');
  }

  const getReviews = async () => {
    const raw = await sanity.query(`
      *[_type == "gearReview" && !(_id in path("drafts.**"))] | order(coalesce(publishedAt,_createdAt) desc){
        _id,productName,title,subtitle,overallRating,activities,activity,gearType,subtype,publishedAt,_createdAt,
        "slug":slug.current,
        "brandName":brand->name,
        heroImage{alt,hotspot,crop,"url":asset->url}
      }
    `);

    return (raw || []).map(review => ({
      id: review._id || '',
      productName: review.productName || '',
      title: review.title || '',
      subtitle: review.subtitle || '',
      overallRating: review.overallRating ?? null,
      activities: Array.isArray(review.activities) ? review.activities : [],
      activity: review.activity || '',
      gearType: review.gearType || '',
      subtype: review.subtype || '',
      publishedAt: review.publishedAt || review._createdAt || '',
      slug: review.slug || '',
      brandName: review.brandName || '',
      heroImage: review.heroImage ? {
        url: review.heroImage.url || '',
        alt: review.heroImage.alt || '',
        focalX: review.heroImage.hotspot?.x ?? 0.5,
        focalY: review.heroImage.hotspot?.y ?? 0.5
      } : null
    }));
  };

  const getLanding = async () => {
    const raw = await sanity.query(`
      *[_id == "gearLanding"][0]{
        heroKicker,
        heroTitle,
        heroIntro,
        introTitle,
        introCopy,
        categoriesKicker,
        categoriesTitle,
        reviewsKicker,
        reviewsTitle,
        libraryKicker,
        libraryTitle
      }
    `);

    if (!raw) return null;

    return {
      heroKicker: raw.heroKicker || '',
      heroTitle: raw.heroTitle || '',
      heroIntro: raw.heroIntro || '',
      introTitle: raw.introTitle || '',
      introCopy: raw.introCopy || '',
      categoriesKicker: raw.categoriesKicker || '',
      categoriesTitle: raw.categoriesTitle || '',
      reviewsKicker: raw.reviewsKicker || '',
      reviewsTitle: raw.reviewsTitle || '',
      libraryKicker: raw.libraryKicker || '',
      libraryTitle: raw.libraryTitle || ''
    };
  };

  window.MITMContent = window.MITMContent || {};
  window.MITMContent.gear = {
    getLanding,
    getReviews
  };
})();
