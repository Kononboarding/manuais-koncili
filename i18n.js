/* Koncili Portal do Seller — seletor de idioma PT | ES
   Uso: acrescente ?lang=es ao link para abrir o portal em espanhol. */
(function () {
  var KEY = 'koncili_lang';
  function readLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'es' || q === 'pt') { try { localStorage.setItem(KEY, q); } catch (e) {} return q; }
    try { return localStorage.getItem(KEY) === 'es' ? 'es' : 'pt'; } catch (e) { return 'pt'; }
  }
  var lang = readLang();
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // ---------- seletor
  var css = document.createElement('style');
  css.textContent =
    '.lang-switch{display:inline-flex;align-items:center;background:#f1f4f4;border:1px solid #dfe6e6;border-radius:999px;padding:3px;gap:2px;margin-left:auto}' +
    '.lang-switch a{font:700 11px/1 Montserrat,Arial,sans-serif;letter-spacing:.8px;color:#787878;text-decoration:none;padding:7px 12px;border-radius:999px;transition:background .2s,color .2s}' +
    '.lang-switch a:hover{color:#153137}' +
    '.lang-switch a.on{background:#153137;color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2)}' +
    'header nav{margin-left:16px!important}' +
    '@media(max-width:520px){header nav{display:none}.lang-switch a{padding:6px 10px}}';
  document.head.appendChild(css);
  var header = document.querySelector('header');
  if (header) {
    var sw = document.createElement('div');
    sw.className = 'lang-switch';
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'Idioma');
    sw.innerHTML = '<a href="?lang=pt" class="' + (lang === 'pt' ? 'on' : '') + '" hreflang="pt-BR">PT</a>' +
                   '<a href="?lang=es" class="' + (lang === 'es' ? 'on' : '') + '" hreflang="es">ES</a>';
    var nav = header.querySelector('nav');
    header.insertBefore(sw, nav || null);
  }
  // ---------- versão dos PDFs (evita cache antigo no navegador)
  // Atualize PDF_V sempre que algum manual for alterado.
  var PDF_V = '20261002-3';
  function addVer() {
    document.querySelectorAll('a[href*=".pdf"]').forEach(function (a) {
      var h = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', h + '?v=' + PDF_V);
    });
  }
  if (lang !== 'es') { addVer(); return; }
  document.documentElement.lang = 'es';

  function $(s) { return document.querySelector(s); }
  function set(s, h) { var e = $(s); if (e) e.innerHTML = h; }
  // links internos levam o idioma
  document.querySelectorAll('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (/^(index|etapa1|etapa2|kickoff)\.html$/.test(h)) a.setAttribute('href', h + '?lang=es');
  });
  document.querySelectorAll('[onclick]').forEach(function (el) {
    var o = el.getAttribute('onclick');
    if (/etapa[12]\.html/.test(o)) el.setAttribute('onclick', o.replace(/(etapa[12]\.html)/, '$1?lang=es'));
  });

  var DL = 'Descargar PDF';
  function cards(map, titleNote) {
    document.querySelectorAll('.manual-card').forEach(function (c) {
      var n = c.querySelector('.manual-card-name'); if (!n) return;
      var m = map[n.textContent.trim()];
      if (!m) { c.remove(); return; }
      n.textContent = m[0];
      c.querySelectorAll('a[href$=".pdf"]').forEach(function (a) { a.setAttribute('href', m[1]); });
      var dl = c.querySelector('.manual-card-dl');
      if (dl && dl.lastChild) dl.lastChild.textContent = DL;
    });
    var order = Object.keys(map).map(function (k) { return map[k][0]; });
    document.querySelectorAll('.manuais-grid').forEach(function (g) {
      Array.prototype.slice.call(g.querySelectorAll('.manual-card')).sort(function (a, b) {
        return order.indexOf(a.querySelector('.manual-card-name').textContent) - order.indexOf(b.querySelector('.manual-card-name').textContent);
      }).forEach(function (c) { g.appendChild(c); });
    });
    document.querySelectorAll('.manuais-grid').forEach(function (g) {
      if (!g.querySelector('.manual-card')) { var t = g.previousElementSibling; if (t && t.classList.contains('manuais-title')) t.remove(); g.remove(); }
    });
    var g = $('.manuais-grid');
    if (g) { var p = document.createElement('p'); p.style.cssText = 'font-size:12px;color:#787878;margin:-14px 0 28px'; p.textContent = titleNote; g.after(p); }
  }

  if (page === 'index.html' || page === '') {
    document.title = 'Onboarding de Sellers — Koncili';
    set('header nav', 'Portal del Seller');
    set('.hero-badge', 'Onboarding de Sellers');
    set('.hero h1', 'Bienvenido a <span>Koncili</span>');
    set('.perfil-label', 'Seleccione una opción:');
    set('#btn-novo .perfil-card-content strong', 'Integrar cuentas a Koncili');
    set('#btn-novo .perfil-card-content span', 'Conecte las cuentas de sus canales al panel Koncili con el acceso proporcionado por el equipo.');
    set('#btn-cliente .perfil-card-content strong', 'Crear usuarios');
    set('#btn-cliente .perfil-card-content span', 'Cree los accesos en los marketplaces utilizando los correos y manuales proporcionados por el equipo Koncili.');
    document.querySelectorAll('footer span, footer a').forEach(function (e) {
      if (e.textContent.indexOf('Uma empresa') > -1) e.textContent = 'Una empresa DB1 Group';
      if (e.textContent.indexOf('Política de Privacidade') > -1) e.textContent = 'Política de Privacidad →';
    });
  }
  if (page === 'etapa2.html') { // Etapa 1 — Integrar contas
    document.title = 'Etapa 1 — Integrar cuentas a Koncili | Koncili';
    set('header nav', 'Etapa 1 de 2');
    set('.back-btn', '&#x2190; Volver');
    set('.hero-badge', '1ª Etapa');
    set('.hero h2', 'Integración en el <span>Panel Koncili</span>');
    set('.hero p', 'Conecte sus canales al panel Koncili. Descargue el manual del marketplace y siga el paso a paso con imágenes.');
    set('.alert p', 'Utilice el <strong>usuario y contraseña proporcionados por el equipo de implementación Koncili</strong> para acceder al panel antes de iniciar la integración. Después de integrar las cuentas, avance a la <a href="etapa1.html?lang=es" style="color:inherit;font-weight:800;">Etapa 2</a> para crear los usuarios en los marketplaces.');
    set('.manuais-title', '&#x1F4C4; Manuales de integración disponibles');
    cards({
      'Mercado Livre': ['Mercado Libre', './pdfs/es/integracion-mercado-libre.pdf'],
      'Falabella': ['Falabella', './pdfs/es/integracion-falabella.pdf'],
      'Amazon': ['Amazon', './pdfs/es/integracion-amazon.pdf']
    }, 'Mostrando solo los canales con manual en español.');
  }
  if (page === 'etapa1.html') { // Etapa 2 — Criar usuários
    document.title = 'Etapa 2 — Crear usuarios | Koncili';
    set('header nav', 'Etapa 2 de 2');
    set('.back-btn', '&#x2190; Volver');
    set('.hero-badge', '2ª Etapa');
    set('.hero h2', 'Manuales de <span>Acceso</span>');
    set('.hero p', 'Descargue el manual del marketplace que va a operar y siga el paso a paso para crear el usuario de acceso.');
    set('.alert p', '<strong>Importante:</strong> Utilice el <strong>correo proporcionado por Koncili</strong> para crear los accesos. Realice esta etapa después de integrar las cuentas en el panel en la <a href="etapa2.html?lang=es" style="color:inherit;font-weight:800;">Etapa 1</a>.');
    set('.manuais-title', '&#x1F4C4; Manuales de creación de acceso');
    (function () { // card Falabella (só existe em ES)
      var base = document.querySelector('.manual-card'); if (!base) return;
      var c = base.cloneNode(true);
      c.querySelector('.manual-card-name').textContent = 'Falabella';
      var img = c.querySelector('.mkt-logo-box img');
      if (img) { img.style.display = ''; img.setAttribute('src', '/manuais-koncili/images/logo-falabella.svg'); }
      base.parentNode.appendChild(c);
    })();
    cards({
      'Mercado Livre': ['Mercado Libre', './pdfs/es/acceso-mercado-libre.pdf'],
      'Falabella': ['Falabella', './pdfs/es/acceso-falabella.pdf'],
      'Amazon': ['Amazon', './pdfs/es/acceso-amazon.pdf']
    }, 'Mostrando solo los canales con manual en español.');
  }
  addVer();
})();
