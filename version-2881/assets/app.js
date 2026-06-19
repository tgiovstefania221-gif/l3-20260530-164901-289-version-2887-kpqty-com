(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === currentSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var value = button.getAttribute('data-filter-value');
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            filterCards.forEach(function (card) {
                var cardValue = card.getAttribute('data-filter') || '';
                var visible = value === 'all' || cardValue === value;
                card.classList.toggle('hidden-card', !visible);
            });
        });
    });

    var searchInput = document.querySelector('[data-search-input]');
    var searchCards = Array.prototype.slice.call(document.querySelectorAll('.search-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    function runSearch(value) {
        var query = (value || '').trim().toLowerCase();
        searchCards.forEach(function (card) {
            var haystack = card.getAttribute('data-search') || '';
            var visible = !query || haystack.indexOf(query) !== -1;
            card.classList.toggle('hidden-card', !visible);
        });
    }

    if (searchInput) {
        searchInput.value = initialQuery;
        runSearch(initialQuery);
        searchInput.addEventListener('input', function () {
            runSearch(searchInput.value);
        });
    }

    var player = document.querySelector('[data-stream]');
    if (player) {
        var stream = player.getAttribute('data-stream');
        var NativeHls = window.Hls;
        if (stream && NativeHls && NativeHls.isSupported()) {
            var hls = new NativeHls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(player);
        } else if (stream && player.canPlayType('application/vnd.apple.mpegurl')) {
            player.src = stream;
        }
    }

    var startButtons = Array.prototype.slice.call(document.querySelectorAll('[data-video-start]'));
    startButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var video = document.querySelector('[data-stream]');
            if (video) {
                video.scrollIntoView({ behavior: 'smooth', block: 'center' });
                var playResult = video.play();
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {});
                }
            }
        });
    });
})();
