(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var nav = document.querySelector("[data-nav]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      showSlide(i);
    });
  });
  if (slides.length) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var input = document.querySelector("[data-search-input]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var genreFilter = document.querySelector("[data-genre-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }
  function runFilter() {
    var q = normalize(input ? input.value : "");
    var year = yearFilter ? yearFilter.value : "";
    var genre = normalize(genreFilter ? genreFilter.value : "");
    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" "));
      var okQuery = !q || text.indexOf(q) !== -1;
      var okYear = !year || card.getAttribute("data-year") === year;
      var okGenre = !genre || text.indexOf(genre) !== -1;
      card.style.display = okQuery && okYear && okGenre ? "" : "none";
    });
  }
  [input, yearFilter, genreFilter].forEach(function (el) {
    if (el) {
      el.addEventListener("input", runFilter);
      el.addEventListener("change", runFilter);
    }
  });
})();
