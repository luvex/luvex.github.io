document.addEventListener('DOMContentLoaded', function () {
  var loadButton = document.getElementById('journal-loadmore');
  if (!loadButton) return;

  var loadText = loadButton.textContent;
  var arrowEl = document.querySelector('.journal-arrow.ja-forward');
  var url = arrowEl ? arrowEl.getAttribute('href') : '';

  var arrowCont = document.getElementById('journal-arrows-cont');
  if (arrowCont) arrowCont.style.display = 'none';

  hideIfNoMorePosts();

  loadButton.addEventListener('click', morePosts);

  window.addEventListener('scroll', function () {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) {
      if (document.body.contains(loadButton)) morePosts();
    }
  });

  function hideIfNoMorePosts() {
    var footer = document.querySelector('footer');
    if (!url || url.length === 0) {
      loadButton.remove();
      if (footer) footer.style.display = '';
    } else {
      loadButton.style.display = '';
      if (footer) footer.style.display = 'none';
    }
  }

  function morePosts() {
    if (loadButton.textContent !== loadText) return;
    var nextUrl = url;
    loadButton.textContent = 'Loading...';

    fetch(nextUrl)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var articles = doc.querySelectorAll('#journal-articles-block > *');
        var block = document.getElementById('journal-articles-block');
        articles.forEach(function (el) {
          block.appendChild(document.importNode(el, true));
        });

        var nextArrow = doc.querySelector('.journal-arrow.ja-forward');
        url = nextArrow ? nextArrow.getAttribute('href') : '';
        loadButton.textContent = loadText;
        hideIfNoMorePosts();
      })
      .catch(function () {
        loadButton.textContent = loadText;
      });

    hideIfNoMorePosts();
  }
});
