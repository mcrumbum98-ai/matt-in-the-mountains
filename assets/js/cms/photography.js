(() => {
  const sanity = window.MITMCmsSanity;
  if (!sanity) throw new Error('CMS adapter is unavailable.');

  const normalizePhoto = photo => ({
    id: photo?._id || '',
    title: photo?.title || '',
    description: photo?.description || '',
    location: photo?.location || '',
    dateTaken: photo?.dateTaken || '',
    image: photo?.image?.url ? {
      url: photo.image.url,
      alt: photo.image.alt || photo.title || '',
      focalX: photo.image.hotspot?.x ?? 0.5,
      focalY: photo.image.hotspot?.y ?? 0.5
    } : null
  });

  const getCollections = async () => {
    const raw = await sanity.query(`
      *[_type == "photoCollection" && !(_id in path("drafts.**"))]
      | order(displayOrder asc, title asc) {
        _id, title, description, displayOrder, showOnLanding,
        "slug": slug.current,
        "coverPhoto": coverPhoto->{
          _id, title, image{alt,hotspot,"url":asset->url}
        },
        "photographs": photographs[]->{
          _id, title, description, location, dateTaken,
          image{alt,hotspot,"url":asset->url}
        }
      }
    `);

    return (raw || []).map(collection => ({
      id: collection._id || '',
      title: collection.title || '',
      slug: collection.slug || '',
      description: collection.description || '',
      displayOrder: collection.displayOrder ?? 10,
      showOnLanding: collection.showOnLanding !== false,
      coverPhoto: collection.coverPhoto
        ? normalizePhoto(collection.coverPhoto)
        : null,
      photographs: (collection.photographs || [])
        .filter(Boolean)
        .map(normalizePhoto)
    }));
  };

  const getPhotographs = async () => {
    const raw = await sanity.query(`
      *[_type == "photograph" && !(_id in path("drafts.**"))]
      | order(coalesce(dateTaken, _createdAt) desc) {
        _id, title, description, location, dateTaken,
        image{alt,hotspot,"url":asset->url}
      }
    `);
    return (raw || []).map(normalizePhoto);
  };

  const getLanding = async () => sanity.query(`
    *[_type == "photographyLanding" && _id == "photographyLanding"][0] {
      introHeading,
      introEmphasis,
      introDescription,
      featuredPhotographs[] {
        caption,
        photograph-> {
          _id,
          title,
          image {
            alt,
            hotspot,
            "url": asset->url
          }
        }
      },
      exhibitionStatement,
      outroHeading,
      outroDescription, galleryViewerStyle
    }
  `);

  window.MITMContent = window.MITMContent || {};
  window.MITMContent.photography = {
    getCollections,
    getPhotographs,
    getLanding
  };
})();
