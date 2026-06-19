(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        initMobileMenu();
        initHeroCarousel();
        initFilters();
        initPlayer();
    });

    function initMobileMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    function initHeroCarousel() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        var roots = document.querySelectorAll('[data-filter-root]');
        roots.forEach(function (root) {
            var container = root.parentElement || document;
            var keyword = root.querySelector('[data-filter-keyword]');
            var year = root.querySelector('[data-filter-year]');
            var region = root.querySelector('[data-filter-region]');
            var reset = root.querySelector('[data-filter-reset]');
            var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
            var counter = container.querySelector('[data-filter-count]');
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get('q');

            if (keyword && initialQuery) {
                keyword.value = initialQuery;
            }

            function apply() {
                var q = keyword ? keyword.value.trim().toLowerCase() : '';
                var y = year ? year.value : '';
                var r = region ? region.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var text = card.getAttribute('data-search') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var cardRegion = card.getAttribute('data-region') || '';
                    var matched = true;

                    if (q && text.indexOf(q) === -1) {
                        matched = false;
                    }
                    if (y && cardYear !== y) {
                        matched = false;
                    }
                    if (r && cardRegion !== r) {
                        matched = false;
                    }
                    card.style.display = matched ? '' : 'none';
                    if (matched) {
                        visible += 1;
                    }
                });

                if (counter) {
                    counter.textContent = '当前显示 ' + visible + ' 部影片';
                }
            }

            [keyword, year, region].forEach(function (input) {
                if (input) {
                    input.addEventListener('input', apply);
                    input.addEventListener('change', apply);
                }
            });
            if (reset) {
                reset.addEventListener('click', function () {
                    if (keyword) {
                        keyword.value = '';
                    }
                    if (year) {
                        year.value = '';
                    }
                    if (region) {
                        region.value = '';
                    }
                    apply();
                });
            }
            apply();
        });
    }

    function initPlayer() {
        var startButton = document.querySelector('[data-player-src]');
        if (!startButton) {
            return;
        }
        var targetId = startButton.getAttribute('data-player-target');
        var video = document.getElementById(targetId);
        var src = startButton.getAttribute('data-player-src');

        if (!video || !src) {
            return;
        }

        startButton.addEventListener('click', function () {
            startButton.classList.add('is-hidden');
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {});
                }, { once: true });
            } else {
                video.src = src;
                video.play().catch(function () {
                    startButton.classList.remove('is-hidden');
                    startButton.textContent = '播放失败，请更换浏览器';
                });
            }
        });
    }
}());
