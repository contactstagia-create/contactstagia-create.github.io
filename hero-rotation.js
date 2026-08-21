/* Hero : photo de fond tirée au hasard à chaque chargement de page.
   Pattern validé en maquette le 16/08/2026 (voir commun/HANDOFF_site_photos-integration_2026-08-16.md) :
   les anciennes images sont capturées AVANT l'ajout de la nouvelle, jamais après —
   sinon la nouvelle image se retrouve elle-même supprimée par erreur (bug corrigé en maquette). */
(function () {
  var PHOTOS = [
    '/assets/hero-photos/H018.jpg',
    '/assets/hero-photos/H023.jpg',
    '/assets/hero-photos/H025.jpg',
    '/assets/hero-photos/H039.jpg',
    '/assets/hero-photos/H043.jpg',
    '/assets/hero-photos/H055.jpg',
    '/assets/hero-photos/H074.jpg',
    '/assets/hero-photos/H081.jpg',
    '/assets/hero-photos/H086.jpg'
  ];

  var bg = document.getElementById('heroPhotoBg');
  if (!bg) return;

  var src = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
  var oldImgs = Array.prototype.slice.call(bg.querySelectorAll('img'));

  var img = document.createElement('img');
  img.src = src;
  img.alt = '';
  bg.appendChild(img);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      img.classList.add('show');
    });
  });

  setTimeout(function () {
    oldImgs.forEach(function (el) { el.remove(); });
  }, 450);
})();
