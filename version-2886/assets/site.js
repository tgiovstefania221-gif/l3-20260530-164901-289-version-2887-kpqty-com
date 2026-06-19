(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('.mobile-menu-button');
    var navLinks = qs('.nav-links');
    var navSearch = qs('.nav-search');

    if (menuButton && navLinks && navSearch) {
        menuButton.addEventListener('click', function () {
            var open = !navLinks.classList.contains('is-open');
            navLinks.classList.toggle('is-open', open);
            navSearch.classList.toggle('is-open', open);
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuButton.textContent = open ? '×' : '☰';
        });
    }

    qsa('.hero-slider').forEach(function (slider) {
        var slides = qsa('.hero-slide', slider);
        var dots = qsa('.hero-dots button', slider);
        var prev = qs('.hero-arrow.prev', slider);
        var next = qs('.hero-arrow.next', slider);
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                restart();
            });
        });

        show(0);
        restart();
    });

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function filterCards(input, scope) {
        var keyword = normalize(input.value);
        var cards = qsa('.movie-card', scope || document);
        var visible = 0;
        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-year')
            ].join(' '));
            var show = !keyword || text.indexOf(keyword) !== -1;
            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });
        var result = qs('.search-result-text');
        if (result) {
            result.textContent = keyword ? '找到 ' + visible + ' 个结果' : '浏览全部影片';
        }
        var empty = qs('.empty-state');
        if (empty) {
            empty.style.display = visible === 0 ? 'block' : 'none';
        }
    }

    qsa('.local-filter-input').forEach(function (input) {
        var scope = input.closest('.filter-scope') || document;
        input.addEventListener('input', function () {
            filterCards(input, scope);
        });
    });

    var searchInput = qs('.search-page-input');
    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query) {
            searchInput.value = query;
        }
        filterCards(searchInput, document);
        searchInput.addEventListener('input', function () {
            filterCards(searchInput, document);
        });
    }

    qsa('.sort-select').forEach(function (select) {
        select.addEventListener('change', function () {
            var grid = qs('.movie-grid', select.closest('.filter-scope') || document);
            if (!grid) {
                return;
            }
            var cards = qsa('.movie-card', grid);
            var value = select.value;
            cards.sort(function (a, b) {
                if (value === 'year') {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                }
                if (value === 'title') {
                    return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                }
                return Number(b.getAttribute('data-heat')) - Number(a.getAttribute('data-heat'));
            });
            cards.forEach(function (card) {
                grid.appendChild(card);
            });
        });
    });

    qsa('.player-shell').forEach(function (shell) {
        var video = qs('video', shell);
        var overlay = qs('.player-overlay', shell);
        if (!video || !overlay) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var ready = false;
        var hls = null;

        function attachStream() {
            if (ready || !stream) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }
            video.src = stream;
        }

        function playVideo() {
            attachStream();
            overlay.classList.add('is-hidden');
            var action = video.play();
            if (action && action.catch) {
                action.catch(function () {});
            }
        }

        overlay.addEventListener('click', playVideo);
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        video.addEventListener('ended', function () {
            overlay.classList.remove('is-hidden');
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
