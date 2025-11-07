(() => {
  const debounce = (fn, delay = 120) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const scaleAreas = (img, map) => {
    const areas = map.querySelectorAll('area');
    if (!areas.length) return;

    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;
    if (!naturalWidth || !naturalHeight) return;

    const currentWidth = img.clientWidth;
    const currentHeight = img.clientHeight || (currentWidth * naturalHeight) / naturalWidth;
    const widthRatio = currentWidth / naturalWidth;
    const heightRatio = currentHeight / naturalHeight;

    areas.forEach((area) => {
      if (!area.dataset.originalCoords) {
        area.dataset.originalCoords = area.coords;
      }

      const updated = area.dataset.originalCoords
        .split(',')
        .map((value) => Number(value.trim()))
        .map((value, index) => {
          const ratio = index % 2 === 0 ? widthRatio : heightRatio;
          return Math.round(value * ratio);
        });

      area.coords = updated.join(',');
    });
  };

  const setupImageMap = (img) => {
    const useMap = img.getAttribute('usemap');
    if (!useMap) return;

    const mapName = useMap.replace('#', '');
    const map = document.querySelector(`map[name="${mapName}"]`);
    if (!map) return;

    const resize = () => scaleAreas(img, map);
    const debouncedResize = debounce(resize);

    if (img.complete) {
      resize();
    } else {
      img.addEventListener('load', resize, { once: true });
    }

    window.addEventListener('resize', debouncedResize);
  };

  document.addEventListener('DOMContentLoaded', () => {
    document
      .querySelectorAll('img[data-responsive-map="true"]')
      .forEach(setupImageMap);
  });
})();
