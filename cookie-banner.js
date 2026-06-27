/* cookie-banner.js — Stagia cookie consent (RGPD)
   Stocke le choix dans localStorage('stagia_consent').
   Met à jour Google Consent Mode v2 selon le choix. */
(function () {
  var KEY = 'stagia_consent';
  var existing = localStorage.getItem(KEY);

  function applyConsent(choice) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: choice === 'granted' ? 'granted' : 'denied' });
    }
  }

  // Choix déjà fait lors d'une visite précédente
  if (existing === 'granted' || existing === 'denied') {
    applyConsent(existing);
    return;
  }

  // Crée le bandeau
  var banner = document.createElement('div');
  banner.id = 'stagia-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Consentement cookies');
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9999',
    'background:#16132A', 'border-top:1px solid rgba(255,255,255,0.1)',
    'padding:14px 32px', 'display:flex', 'align-items:center',
    'justify-content:space-between', 'gap:20px', 'flex-wrap:wrap',
    'font-family:system-ui,-apple-system,sans-serif',
    'box-shadow:0 -4px 24px rgba(0,0,0,0.4)',
    'transform:translateY(100%)', 'transition:transform 280ms ease'
  ].join(';');

  banner.innerHTML =
    '<p style="margin:0;font-size:13px;color:#9B97B4;line-height:1.55;max-width:640px;">' +
      'Ce site utilise Google Analytics pour mesurer son audience de façon anonyme. ' +
      '<a href="confidentialite.html" style="color:#F5C25F;text-underline-offset:3px;text-decoration:underline;">En savoir plus</a>' +
    '</p>' +
    '<div style="display:flex;gap:10px;flex:none;">' +
      '<button id="stagia-refuse" style="all:unset;cursor:pointer;font-size:13px;color:#9B97B4;' +
        'padding:8px 16px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;' +
        'white-space:nowrap;transition:border-color 120ms ease;">' +
        'Continuer sans accepter' +
      '</button>' +
      '<button id="stagia-accept" style="all:unset;cursor:pointer;font-size:13px;font-weight:700;' +
        'color:#0C0A18;background:#F5C25F;padding:8px 18px;border-radius:8px;white-space:nowrap;">' +
        'Accepter' +
      '</button>' +
    '</div>';

  document.body.appendChild(banner);

  // Slide-in après insertion dans le DOM
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.style.transform = 'translateY(0)';
    });
  });

  function dismiss(choice) {
    localStorage.setItem(KEY, choice);
    applyConsent(choice);
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
  }

  document.getElementById('stagia-accept').addEventListener('click', function () { dismiss('granted'); });
  document.getElementById('stagia-refuse').addEventListener('click', function () { dismiss('denied'); });
})();
