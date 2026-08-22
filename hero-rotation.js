/* Hero : photo de fond tirée au hasard à chaque chargement de page.
   Pattern validé en maquette le 16/08/2026 (voir commun/HANDOFF_site_photos-integration_2026-08-16.md) :
   les anciennes images sont capturées AVANT l'ajout de la nouvelle, jamais après —
   sinon la nouvelle image se retrouve elle-même supprimée par erreur (bug corrigé en maquette). */
(function () {
  /* Base résolue depuis l'URL réelle de ce script (pas un chemin absolu en dur) :
     fonctionne pareil en production (FR et EN pointent tous les deux vers la racine
     du site) et en local via file:// (où un chemin commençant par "/" pointerait à
     tort vers la racine du disque). */
  var scriptEl = document.currentScript;
  var base = scriptEl ? scriptEl.src.replace(/hero-rotation\.js(\?.*)?$/, '') : '';
  var PHOTOS = ['H018.jpg', 'H023.jpg', 'H025.jpg', 'H039.jpg', 'H043.jpg', 'H055.jpg', 'H074.jpg', 'H081.jpg', 'H086.jpg']
    .map(function (f) { return base + 'assets/hero-photos/' + f; });

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
