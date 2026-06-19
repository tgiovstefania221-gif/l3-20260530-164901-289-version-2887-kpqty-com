(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(i);
        play();
      });
    });
    play();
  }

  function initFilters() {
    var lists = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list]"));
    if (!lists.length) {
      return;
    }
    var searchInput = document.querySelector("[data-search-input]") || document.querySelector("[data-local-filter]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var regionSelect = document.querySelector("[data-filter-region]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");
    if (initial && searchInput) {
      searchInput.value = initial;
    }
    function currentQuery() {
      return normalize(searchInput ? searchInput.value : "");
    }
    function apply() {
      var q = currentQuery();
      var year = yearSelect ? yearSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      lists.forEach(function (list) {
        var items = Array.prototype.slice.call(list.querySelectorAll(".movie-card, .rank-item"));
        items.forEach(function (item) {
          var haystack = normalize([
            item.getAttribute("data-title"),
            item.getAttribute("data-tags"),
            item.getAttribute("data-region"),
            item.getAttribute("data-type"),
            item.getAttribute("data-year")
          ].join(" "));
          var matchText = !q || haystack.indexOf(q) !== -1;
          var matchYear = !year || item.getAttribute("data-year") === year;
          var matchRegion = !region || item.getAttribute("data-region") === region;
          var matchType = !type || item.getAttribute("data-type") === type;
          item.classList.toggle("is-filter-hidden", !(matchText && matchYear && matchRegion && matchType));
        });
      });
    }
    [searchInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  window.initPlayer = function (source) {
    ready(function () {
      var video = document.querySelector("[data-player-video]");
      var button = document.querySelector("[data-player-button]");
      if (!video || !button || !source) {
        return;
      }
      var prepared = false;
      function begin() {
        button.classList.add("is-hidden");
        if (!prepared) {
          prepared = true;
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.play().catch(function () {});
          } else {
            video.src = source;
            video.play().catch(function () {});
          }
        } else {
          video.play().catch(function () {});
        }
      }
      button.addEventListener("click", begin);
      video.addEventListener("click", function () {
        if (video.paused) {
          begin();
        } else {
          video.pause();
        }
      });
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
