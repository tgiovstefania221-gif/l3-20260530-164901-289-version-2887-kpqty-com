(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var index = 0;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-slide'), 10) || 0);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5600);
    }
  }

  var filterPanels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
  filterPanels.forEach(function (panel) {
    var scope = panel.parentElement ? panel.parentElement.querySelector('.filter-scope') : null;
    if (!scope) {
      return;
    }
    var cards = Array.prototype.slice.call(scope.children);
    var input = panel.querySelector('.filter-input');
    var year = panel.querySelector('.filter-year');
    var region = panel.querySelector('.filter-region');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
    }
    var apply = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var selectedRegion = region ? region.value : '';
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var okYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var okRegion = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
        card.classList.toggle('is-filter-hidden', !(okKeyword && okYear && okRegion));
      });
    };
    [input, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  });
})();

function initMoviePlayer(sourceUrl) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('play-overlay');
  if (!video || !overlay || !sourceUrl) {
    return;
  }
  var ready = false;
  var prepare = function () {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  };
  var start = function () {
    prepare();
    overlay.classList.add('is-hidden');
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  };
  overlay.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });
}
