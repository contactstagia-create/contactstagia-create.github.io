/* cookie-banner.js — Stagia cookie consent (RGPD)
   Stocke le choix dans localStorage('stagia_consent').
   Google Tag Manager / Google Analytics ne sont chargés QU'APRES acceptation : tant que le visiteur n'a pas accepté,
   aucune requête n'est envoyée à Google pour la mesure d'audience (les pages ne contiennent plus que le dataLayer et le
   consentement « refusé » par défaut). Le choix peut être changé à tout moment : tout élément [data-cookie-settings]
   (lien « Gérer les cookies » du pied de page) rouvre le bandeau ; un refus supprime les cookies de mesure.
   Bilingue FR/EN selon document.documentElement.lang. */
(function () {
  var KEY = 'stagia_consent';
  var GTM_ID = 'GTM-WF8H5RWM';

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  var STRINGS = {
    fr: {
      dialogLabel: 'Consentement cookies',
      text: 'Ce site utilise Google Analytics pour mesurer son audience, uniquement si vous acceptez. Si vous refusez, aucun cookie n\'est déposé et rien n\'est envoyé à Google pour cette mesure. ',
      learnMore: 'En savoir plus',
      refuse: 'Refuser',
      accept: 'Accepter'
    },
    en: {
      dialogLabel: 'Cookie consent',
      text: 'This site uses Google Analytics to measure its audience, only if you accept. If you decline, no cookie is set and nothing is sent to Google for this measurement. ',
      learnMore: 'Learn more',
      refuse: 'Decline',
      accept: 'Accept'
    }
  };
  var lang = (document.documentElement.lang || 'fr').indexOf('en') === 0 ? 'en' : 'fr';
  var s = STRINGS[lang];

  // Charge Google Tag Manager (une seule fois), seulement après acceptation
  function loadGtm() {
    if (window.__stagiaGtmLoaded) return;
    window.__stagiaGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(g);
  }

  // Supprime les cookies de mesure Google Analytics (retrait du consentement)
  function deleteMeasurementCookies() {
    var host = location.hostname;
    var bare = host.indexOf('www.') === 0 ? host.slice(4) : host;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].replace(/^\s+/, '');
      if (!/^(_ga|_gid|_gat)/.test(name)) return;
      ['', ';domain=' + host, ';domain=.' + bare].forEach(function (d) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + d;
      });
    });
  }

  function applyConsent(choice) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: choice === 'granted' ? 'granted' : 'denied' });
    }
    if (choice === 'granted') loadGtm();
    else deleteMeasurementCookies();
  }

  var banner = null;

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.id = 'stagia-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', s.dialogLabel);
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9999',
      'background:#16132A', 'border-top:1px solid rgba(255,255,255,0.1)',
      'padding:14px 32px', 'display:flex', 'align-items:center',
      'justify-content:space-between', 'gap:20px', 'flex-wrap:wrap',
      'font-family:system-ui,-apple-system,sans-serif',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.4)',
      'transform:translateY(100%)', 'transition:transform 280ms ease'
    ].join(';');

    // Les deux boutons ont exactement le même style (refuser aussi visible qu'accepter)
    var btn = 'all:unset;cursor:pointer;font-size:13px;font-weight:700;color:#0C0A18;background:#F5C25F;' +
      'padding:8px 18px;border-radius:8px;white-space:nowrap;text-align:center;min-width:84px;box-sizing:border-box;';

    banner.innerHTML =
      '<p style="margin:0;font-size:13px;color:#9B97B4;line-height:1.55;max-width:640px;">' +
        s.text +
        '<a href="/' + (lang === 'en' ? 'en/confidentialite.html' : 'confidentialite.html') + '" style="color:#F5C25F;text-underline-offset:3px;text-decoration:underline;">' + s.learnMore + '</a>' +
      '</p>' +
      '<div style="display:flex;gap:10px;flex:none;">' +
        '<button id="stagia-refuse" style="' + btn + '">' + s.refuse + '</button>' +
        '<button id="stagia-accept" style="' + btn + '">' + s.accept + '</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Slide-in après insertion dans le DOM
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.style.transform = 'translateY(0)';
      });
    });

    function dismiss(choice) {
      try { localStorage.setItem(KEY, choice); } catch (e) {}
      applyConsent(choice);
      var b = banner;
      banner = null;
      b.style.transform = 'translateY(100%)';
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 300);
    }

    document.getElementById('stagia-accept').addEventListener('click', function () { dismiss('granted'); });
    document.getElementById('stagia-refuse').addEventListener('click', function () { dismiss('denied'); });
  }

  // Lien « Gérer les cookies » : rouvre le bandeau (le choix actuel reste actif tant qu'un nouveau choix n'est pas fait)
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.hasAttribute && t.hasAttribute('data-cookie-settings')) {
        e.preventDefault();
        showBanner();
        var first = document.getElementById('stagia-refuse');
        if (first) first.focus();
        return;
      }
      t = t.parentNode;
    }
  });

  var existing = readChoice();
  if (existing === 'granted' || existing === 'denied') {
    applyConsent(existing);
  } else {
    showBanner();
  }
})();
