(() => {
  const sanity = window.MITMCmsSanity;

  if (!sanity) throw new Error('CMS adapter is unavailable.');

  const getPage = async () => {
    return sanity.query(`
      *[_type == "aboutPage" && _id == "aboutPage"][0] {
        heading,
        portraitCaption,
        introduction,
        biography,
        richIntroduction,
        richBiography,
        portrait {
          alt,
          hotspot,
          "url": asset->url
        }
      }
    `);
  };

  window.MITMContent = window.MITMContent || {};
  window.MITMContent.about = {getPage};
})();
