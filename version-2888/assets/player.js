(function () {
  function setupPlayer() {
    var video = document.querySelector('[data-player]');
    if (!video) {
      return;
    }

    var overlay = document.querySelector('[data-play-layer]');
    var button = document.querySelector('[data-play-trigger]');
    var stream = video.getAttribute('data-stream');
    var hasStarted = false;
    var manifestReady = false;
    var startAfterReady = false;

    function requestPlay() {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    function startPlayback() {
      hasStarted = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (manifestReady || video.canPlayType('application/vnd.apple.mpegurl')) {
        requestPlay();
      } else {
        startAfterReady = true;
      }
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        manifestReady = true;
        if (startAfterReady || hasStarted) {
          requestPlay();
        }
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        }
      });
    } else {
      video.src = stream;
      manifestReady = true;
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        startPlayback();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupPlayer);
}());
