(() => {
  const root = document.documentElement;
  const expected = Number(root.dataset.cmsParts || 0);

  if (!expected) return;

  let ready = 0;
  let finished = false;

  const finish = () => {
    if (finished || ready < expected) return;

    finished = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add('cms-ready');
        window.dispatchEvent(new CustomEvent('mitm:cms-ready'));
      });
    });
  };

  window.MITMCmsPage = {
    ready() {
      ready += 1;
      finish();
    }
  };
})();
