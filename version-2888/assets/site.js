(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = qs('[data-mobile-toggle]');
    var panel = qs('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', panel.classList.contains('is-open'));
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupCards() {
    var roots = qsa('[data-card-scope]');
    if (!roots.length) {
      return;
    }
    roots.forEach(function (root) {
      var search = qs('[data-card-search]', root);
      var year = qs('[data-filter-year]', root);
      var region = qs('[data-filter-region]', root);
      var type = qs('[data-filter-type]', root);
      var cards = qsa('.movie-card', root);
      var empty = qs('[data-empty-state]', root);

      function valueOf(input) {
        return input ? input.value.trim().toLowerCase() : '';
      }

      function apply() {
        var text = valueOf(search);
        var yearValue = valueOf(year);
        var regionValue = valueOf(region);
        var typeValue = valueOf(type);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
          var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
          var cardType = (card.getAttribute('data-type') || '').toLowerCase();
          var ok = true;
          if (text && haystack.indexOf(text) === -1) {
            ok = false;
          }
          if (yearValue && cardYear !== yearValue) {
            ok = false;
          }
          if (regionValue && cardRegion !== regionValue) {
            ok = false;
          }
          if (typeValue && cardType !== typeValue) {
            ok = false;
          }
          card.classList.toggle('is-filtered', !ok);
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [search, year, region, type].forEach(function (input) {
        if (!input) {
          return;
        }
        input.addEventListener('input', apply);
        input.addEventListener('change', apply);
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && search) {
        search.value = q;
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupCards();
  });
}());
