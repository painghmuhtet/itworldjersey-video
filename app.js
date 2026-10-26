(() => {
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  document.querySelectorAll('.like-action').forEach(button => {
    button.addEventListener('click', () => {
      const liked = button.classList.toggle('liked');
      button.querySelector('.like-count').textContent = liked ? 'Liked' : 'Like';
      notify(liked ? 'Liked — connect the API to save this action.' : 'Like removed.');
    });
  });
  document.querySelectorAll('.comments-action').forEach(button => button.addEventListener('click', () => notify('Comments API is not connected yet.')));
  document.querySelectorAll('.share-action').forEach(button => button.addEventListener('click', async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({title:'IT WORLD JERSEY Videos', text:'Watch IT WORLD JERSEY videos', url});
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); notify('Video link copied.'); }
      else notify('Copy this page URL from your browser.');
    } catch (error) { if (error && error.name !== 'AbortError') notify('Sharing is unavailable in this browser.'); }
  }));
  document.querySelectorAll('.more-action').forEach(button => button.addEventListener('click', () => {
    const menu = button.parentElement.querySelector('.more-menu');
    menu.hidden = !menu.hidden;
  }));
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', async () => {
    const action = button.dataset.action;
    const url = window.location.href;
    if (action === 'copy') {
      try { await navigator.clipboard.writeText(url); notify('Link copied.'); }
      catch { notify('Clipboard permission is unavailable. Copy the browser URL instead.'); }
    } else if (action === 'download') {
      const video = document.querySelector('.video-player');
      if (video && video.currentSrc) {
        const link = document.createElement('a'); link.href = video.currentSrc; link.download = 'itworldjersey-video'; link.click();
      } else notify('Download will be available when a downloadable video source is configured.');
    } else if (action === 'report') {
      notify('Report API is not connected yet.');
    }
    button.closest('.more-menu').hidden = true;
  }));
  document.getElementById('social-link').addEventListener('click', event => {
    event.preventDefault();
    notify('Social API sources will be configured in a future update.');
  });
})();