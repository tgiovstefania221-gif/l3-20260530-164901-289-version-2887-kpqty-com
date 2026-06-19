(function () {
  const d = document;
  const $ = (sel, root = d) => root.querySelector(sel);
  const $$ = (sel, root = d) => Array.from(root.querySelectorAll(sel));

  const mobileToggle = $('[data-mobile-toggle]');
  const mobilePanel = $('[data-mobile-panel]');
  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => mobilePanel.classList.toggle('open'));
  }

  const searchInput = $('[data-site-search]');
  const applySearch = () => {
    if (!searchInput) return;
    const q = searchInput.value.trim().toLowerCase();
    $$('[data-search-item]').forEach(card => {
      const hay = (card.getAttribute('data-keywords') || card.textContent || '').toLowerCase();
      card.classList.toggle('hidden', q && !hay.includes(q));
    });
  };
  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
    applySearch();
  }

  const slider = $('[data-hero-slider]');
  if (slider) {
    const slides = $$('.slide', slider);
    const dots = $$('.hero-dot', slider);
    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((el, idx) => el.classList.toggle('active', idx === index));
      dots.forEach((el, idx) => el.classList.toggle('active', idx === index));
    };
    dots.forEach((dot, idx) => dot.addEventListener('click', () => show(idx)));
    show(0);
    setInterval(() => show(index + 1), 4500);
  }

  const player = $('[data-player]');
  if (player) {
    const video = $('video', player);
    const playBtn = $('[data-play]', player);
    if (video) {
      const mp4 = video.getAttribute('data-mp4');
      const hls = video.getAttribute('data-hls');
      const canNativeHls = video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');
      if (hls && canNativeHls) video.src = hls;
      else if (mp4) video.src = mp4;
    }
    if (playBtn && video) {
      playBtn.addEventListener('click', async () => { try { await video.play(); } catch(e) {} });
    }
  }

  $$('.pill[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = (btn.getAttribute('data-filter') || '').toLowerCase();
      const root = btn.closest('[data-filter-root]') || d;
      $$('[data-search-item]', root).forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const show = !f || f === 'all' || tags.includes(f);
        card.classList.toggle('hidden', !show);
      });
      $$('.pill[data-filter]', root).forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();
