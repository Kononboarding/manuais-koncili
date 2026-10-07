/* Koncili Portal do Seller — guia de primeiro acesso
   Mostra uma mensagem de boas-vindas e setas indicando as 2 opções da tela inicial.
   Aparece no primeiro acesso e reaparece depois de 15 dias (por navegador); "Ver o guia novamente" reabre. */
(function () {
  var KEY = 'koncili_guia_v1', DIAS = 15;
  var lang = 'pt';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    lang = (q === 'es' || (!q && localStorage.getItem('koncili_lang') === 'es')) ? 'es' : 'pt';
  } catch (e) {}
  var T = {
    pt: {
      wTitle: 'Bem-vindo ao Portal do Seller!',
      wText: 'Aqui você encontra tudo para concluir o seu onboarding no Koncili. São <strong>2 etapas</strong>, e vamos mostrar onde fica cada uma.',
      start: 'Mostrar o caminho', skip: 'Pular',
      s1Tag: '1ª etapa', s1Title: 'Integrar as contas dos marketplaces',
      s1Text: 'Comece por aqui: conecte as contas dos seus marketplaces ao painel Koncili, usando o acesso que a nossa equipe enviou.',
      s2Tag: '2ª etapa', s2Title: 'Criar os acessos nas contas',
      s2Text: 'Depois, venha aqui para criar o usuário Koncili em cada marketplace, com o e-mail e os manuais enviados pela equipe.',
      next: 'Próximo', done: 'Entendi', again: 'Ver o guia novamente', step: 'de'
    },
    es: {
      wTitle: '¡Bienvenido al Portal del Seller!',
      wText: 'Aquí encontrará todo para completar su onboarding en Koncili. Son <strong>2 etapas</strong> y le mostraremos dónde está cada una.',
      start: 'Mostrar el camino', skip: 'Omitir',
      s1Tag: '1ª etapa', s1Title: 'Integrar las cuentas de los marketplaces',
      s1Text: 'Empiece aquí: conecte las cuentas de sus marketplaces al panel Koncili, con el acceso que envió nuestro equipo.',
      s2Tag: '2ª etapa', s2Title: 'Crear los accesos en las cuentas',
      s2Text: 'Después, venga aquí para crear el usuario Koncili en cada marketplace, con el correo y los manuales enviados por el equipo.',
      next: 'Siguiente', done: 'Entendido', again: 'Ver la guía de nuevo', step: 'de'
    }
  }[lang];

  var css = document.createElement('style');
  css.textContent =
    '.kg-dim{position:fixed;inset:0;background:rgba(10,30,34,.62);z-index:9990;opacity:0;transition:opacity .25s}' +
    '.kg-dim.on{opacity:1}' +
    '.kg-hole{position:fixed;z-index:9991;border-radius:14px;box-shadow:0 0 0 4px #74e635,0 0 0 9999px rgba(10,30,34,.62);pointer-events:none;transition:all .35s ease}' +
    '.kg-box{position:fixed;z-index:9993;background:#fff;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.28);padding:22px 22px 18px;width:min(360px,calc(100vw - 32px));font-family:Montserrat,Arial,sans-serif;color:#153137;transition:top .35s ease,left .35s ease}' +
    '.kg-box h3{margin:6px 0 8px;font-size:17px;font-weight:800;line-height:1.3}' +
    '.kg-box p{margin:0 0 16px;font-size:13.5px;line-height:1.55;color:#4f4f4f}' +
    '.kg-tag{display:inline-block;background:#3aaa35;color:#fff;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;padding:4px 10px;border-radius:999px}' +
    '.kg-row{display:flex;align-items:center;gap:10px}' +
    '.kg-row .kg-n{font-size:12px;color:#9a9a9a;margin-right:auto}' +
    '.kg-btn{font:700 13px Montserrat,Arial,sans-serif;border:0;border-radius:8px;padding:10px 16px;cursor:pointer}' +
    '.kg-pri{background:#153137;color:#fff}.kg-pri:hover{background:#3aaa35}' +
    '.kg-sec{background:transparent;color:#787878}.kg-sec:hover{color:#153137}' +
    '.kg-arrow{position:fixed;z-index:9992;width:64px;height:64px;pointer-events:none;color:#74e635;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))}' +
    '.kg-arrow.down{animation:kgDown 1s ease-in-out infinite}.kg-arrow.up{animation:kgUp 1s ease-in-out infinite}' +
    '@keyframes kgDown{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}' +
    '@keyframes kgUp{0%,100%{transform:translateY(0) rotate(180deg)}50%{transform:translateY(-10px) rotate(180deg)}}' +
    '.kg-welcome{left:50%!important;top:50%!important;transform:translate(-50%,-50%);width:min(440px,calc(100vw - 32px));text-align:center;padding:30px 28px 24px}' +
    '.kg-welcome h3{font-size:21px}.kg-welcome .kg-row{justify-content:center}' +
    '.kg-again{display:block;margin:10px auto 0;background:none;border:0;color:#74e635;font:600 12px Montserrat,Arial,sans-serif;text-decoration:underline;cursor:pointer}' +
    '@media (prefers-reduced-motion:reduce){.kg-arrow{animation:none!important}.kg-hole,.kg-box{transition:none}}';
  document.head.appendChild(css);

  var dim, hole, box, arrow, idx = -1, steps;
  var ARROW = '<svg viewBox="0 0 64 64" width="64" height="64" fill="currentColor"><path d="M26 4h12v32h14L32 60 12 36h14z"/></svg>';

  function el(tag, cls, html) { var e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; document.body.appendChild(e); return e; }
  function remember() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function close() {
    remember();
    [dim, hole, box, arrow].forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
    dim = hole = box = arrow = null; idx = -1;
    window.removeEventListener('resize', place); window.removeEventListener('scroll', place);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function welcome() {
    dim = el('div', 'kg-dim'); requestAnimationFrame(function () { dim.classList.add('on'); });
    box = el('div', 'kg-box kg-welcome',
      '<div style="font-size:34px;line-height:1">👋</div><h3>' + T.wTitle + '</h3><p>' + T.wText + '</p>' +
      '<div class="kg-row"><button class="kg-btn kg-sec" data-a="skip">' + T.skip + '</button>' +
      '<button class="kg-btn kg-pri" data-a="next">' + T.start + ' →</button></div>');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.querySelector('[data-a=next]').focus();
    box.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
  }
  function onClick(e) {
    var a = e.target.getAttribute && e.target.getAttribute('data-a');
    if (a === 'skip' || a === 'done') close();
    if (a === 'next') show(idx + 1);
  }
  function show(i) {
    idx = i; var s = steps[i];
    if (dim) { dim.parentNode.removeChild(dim); dim = null; }
    if (!hole) hole = el('div', 'kg-hole');
    if (!arrow) arrow = el('div', 'kg-arrow', ARROW);
    box.className = 'kg-box'; box.removeAttribute('style');
    var last = i === steps.length - 1;
    box.innerHTML = '<span class="kg-tag">' + s.tag + '</span><h3>' + s.title + '</h3><p>' + s.text + '</p>' +
      '<div class="kg-row"><span class="kg-n">' + (i + 1) + ' ' + T.step + ' ' + steps.length + '</span>' +
      (last ? '' : '<button class="kg-btn kg-sec" data-a="skip">' + T.skip + '</button>') +
      '<button class="kg-btn kg-pri" data-a="' + (last ? 'done' : 'next') + '">' + (last ? T.done + ' ✓' : T.next + ' →') + '</button></div>';
    box.querySelector('.kg-pri').focus();
    s.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setTimeout(place, 350); place();
    window.addEventListener('resize', place); window.addEventListener('scroll', place);
  }
  function place() {
    if (idx < 0 || !hole) return;
    var r = steps[idx].el.getBoundingClientRect(), pad = 8, vw = innerWidth, vh = innerHeight;
    hole.style.cssText = 'left:' + (r.left - pad) + 'px;top:' + (r.top - pad) + 'px;width:' + (r.width + 2 * pad) + 'px;height:' + (r.height + 2 * pad) + 'px';
    var bw = box.offsetWidth, bh = box.offsetHeight, gap = 78;
    var below = r.bottom + gap + bh < vh || r.top - gap - bh < 0;
    var cx = r.left + r.width / 2;
    var left = Math.max(16, Math.min(vw - bw - 16, cx - bw / 2));
    var top = below ? r.bottom + pad + gap : r.top - pad - gap - bh;
    box.style.left = left + 'px'; box.style.top = top + 'px';
    // seta entre a caixa e o card, apontando para o card
    arrow.className = 'kg-arrow ' + (below ? 'up' : 'down');
    arrow.style.left = (cx - 32) + 'px';
    arrow.style.top = (below ? r.bottom + pad + 6 : r.top - pad - 70) + 'px';
  }
  function start() {
    var b1 = document.getElementById('btn-novo'), b2 = document.getElementById('btn-cliente');
    if (!b1 || !b2) return;
    steps = [
      { el: b1, tag: T.s1Tag, title: T.s1Title, text: T.s1Text },
      { el: b2, tag: T.s2Tag, title: T.s2Title, text: T.s2Text }
    ];
    // clicar numa das opções durante o guia também encerra o guia
    [b1, b2].forEach(function (b) { b.addEventListener('click', function () { if (box) close(); }); });
    welcome();
  }
  function init() {
    // só no computador: em telas pequenas (celular) o guia não é exibido
    if (window.matchMedia && matchMedia('(max-width: 899px)').matches) return;
    var lbl = document.querySelector('.perfil-section');
    if (lbl) {
      var again = document.createElement('button');
      again.className = 'kg-again'; again.type = 'button'; again.textContent = T.again;
      again.addEventListener('click', function () { if (!box) start(); });
      lbl.appendChild(again);
    }
    var seen = false; try { var ts = +localStorage.getItem(KEY); seen = ts > 0 && Date.now() - ts < DIAS * 864e5; } catch (e) {}
    if (!seen && !new URLSearchParams(location.search).get('perfil')) setTimeout(start, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
