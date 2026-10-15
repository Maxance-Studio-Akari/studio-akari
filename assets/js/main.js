/* Studio Akari — interactions communes à toutes les pages :
   menu mobile, barre de progression, apparitions au défilement,
   scènes lumineuses d'attente des images, projecteur et filtres de la galerie. */
(function () {
  'use strict';

  window.__akari = true;
  var root = document.documentElement;
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- En-tête : menu mobile ---------- */

  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu-mobile');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Fermer' : 'Menu';
      toggle.closest('.site-header').classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    var wide = window.matchMedia('(min-width: 900px)');
    var onWide = function () { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* ---------- En-tête : progression de lecture ---------- */

  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var raf = 0;
    function update() {
      raf = 0;
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Apparitions au défilement ---------- */

  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var REVEAL = {
    up: { kf: [{ opacity: 0, transform: 'translateY(44px)', filter: 'blur(10px)' }, { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }], d: 1100 },
    blur: { kf: [{ opacity: 0, transform: 'translateY(18px) scale(1.02)', filter: 'blur(16px)' }, { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' }], d: 1300 },
    rise: { kf: [{ opacity: 0, transform: 'translateY(105%)', filter: 'blur(8px)' }, { opacity: 1, transform: 'translateY(0%)', filter: 'blur(0px)' }], d: 1200 },
    fade: { kf: [{ opacity: 0 }, { opacity: 1 }], d: 900 },
    line: { kf: [{ opacity: 1, transform: 'scaleX(0)', transformOrigin: 'left center' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left center' }], d: 1000 },
    clip: { kf: [{ opacity: 1, clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(12px)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)' }], d: 1400, ease: 'cubic-bezier(.77,0,.18,1)' }
  };

  var reveal = { observe: function () {} };

  function initReveal() {
    var supported = 'IntersectionObserver' in window && !!Element.prototype.animate;
    if (!root.classList.contains('motion') || !supported) {
      root.classList.remove('motion');
      return;
    }

    function done(el) { el.classList.add('is-revealed'); }

    function play(el) {
      var R = REVEAL[el.getAttribute('data-reveal')] || REVEAL.up;
      var anim = el.animate(R.kf, {
        duration: R.d,
        delay: +(el.getAttribute('data-delay') || 0),
        easing: R.ease || EASE,
        fill: 'both'
      });
      anim.onfinish = function () { done(el); anim.cancel(); };
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); play(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Dans une zone [data-intro] (haut de l'accueil), tout s'anime dès le chargement :
    // les éléments posés en bas de l'écran (« Défiler », carte) n'attendent pas un défilement.
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.closest('[data-intro]')) play(el);
      else io.observe(el);
    });

    reveal.observe = function (el) {
      el.classList.remove('is-revealed');
      io.observe(el);
    };
  }

  /* ---------- Scènes lumineuses (affichées tant que la photo n'est pas chargée) ---------- */

  var NONE = 'rgba(0,0,0,0)';
  function GOLD(a) { return 'rgba(214,184,107,' + a + ')'; }
  function CREAM(a) { return 'rgba(246,231,189,' + a + ')'; }

  function A(style, kids) {
    var d = document.createElement('div');
    d.style.position = 'absolute';
    Object.keys(style).forEach(function (k) {
      var v = style[k];
      if (typeof v === 'number') v = v + 'px';
      if (k.indexOf('--') === 0) d.style.setProperty(k, v);
      else d.style[k] = v;
    });
    [].concat(kids || []).forEach(function add(c) {
      if (Array.isArray(c)) c.forEach(add);
      else if (c) d.appendChild(c);
    });
    return d;
  }
  function frame(bg, kids, extra) {
    return A(Object.assign({ inset: 0, overflow: 'hidden', background: bg }, extra || {}), kids);
  }
  function rng(seed) {
    var s = seed;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function dust(n, seed, x, y, w, h) {
    var r = rng(seed), out = [];
    for (var i = 0; i < n; i++) {
      var sz = 1.5 + r() * 2.5;
      out.push(A({
        left: (x + r() * w) + '%', top: (y + r() * h) + '%', width: sz, height: sz, borderRadius: '50%',
        background: CREAM(0.5 + r() * 0.4), boxShadow: '0 0 ' + (6 + sz * 2) + 'px ' + CREAM(0.7),
        '--dx': (r() * 30 - 15) + 'px', '--dy': (-12 - r() * 36) + 'px',
        animation: 'akariFloat ' + (6 + r() * 8) + 's ease-in-out ' + (-r() * 8) + 's infinite alternate'
      }));
    }
    return out;
  }
  function corners(inset, size, color) {
    return ['tl', 'tr', 'bl', 'br'].map(function (c) {
      var st = { width: size, height: size };
      st[c[0] === 't' ? 'top' : 'bottom'] = inset;
      st[c[1] === 'l' ? 'left' : 'right'] = inset;
      st[c[0] === 't' ? 'borderTop' : 'borderBottom'] = '1.5px solid ' + color;
      st[c[1] === 'l' ? 'borderLeft' : 'borderRight'] = '1.5px solid ' + color;
      return A(st);
    });
  }
  function panes(bg) {
    return [0, 1, 2, 3].map(function () {
      var p = document.createElement('div');
      p.style.background = bg;
      return p;
    });
  }

  var SCENES = {
    beam: function () {
      return frame('radial-gradient(120% 100% at 72% 0%, #3b3123 0%, #1d1a16 48%, #121212 100%)', [
        A({ inset: 0, animation: 'akariSlide 14s ease-in-out infinite alternate' }, [0, 1, 2, 3].map(function (i) {
          return A({ top: '-30%', left: (34 + i * 14) + '%', width: (8 + (i % 2) * 9) + '%', height: '170%', transform: 'rotate(' + (22 + i * 4) + 'deg)', transformOrigin: 'top center', background: 'linear-gradient(180deg, ' + CREAM(0.5 - i * 0.07) + ' 0%, ' + GOLD(0.14) + ' 55%, ' + NONE + ' 85%)', filter: 'blur(' + (20 + i * 8) + 'px)', animation: 'akariPulse ' + (5 + i * 1.7) + 's ease-in-out ' + (-i) + 's infinite alternate' });
        })),
        A({ top: '-22%', right: '2%', width: '44%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle, ' + CREAM(0.75) + ' 0%, ' + GOLD(0.25) + ' 30%, ' + NONE + ' 65%)', filter: 'blur(18px)', animation: 'akariBreath 7s ease-in-out infinite alternate' }),
        A({ left: 0, right: 0, top: '76%', height: 1, background: 'linear-gradient(90deg, ' + NONE + ', ' + CREAM(0.55) + ' 60%, ' + NONE + ')' }),
        dust(26, 7, 25, 5, 70, 70)
      ]);
    },
    softbox: function () {
      return frame('radial-gradient(90% 70% at 55% 100%, #2b251c 0%, #171513 55%, #111111 100%)', [
        A({ left: '50%', top: '12%', width: '40%', height: '46%', transform: 'translateX(-50%) perspective(700px) rotateY(-16deg)', borderRadius: 4, background: 'linear-gradient(180deg, #FFF9EA 0%, #F4E3B8 55%, #D6B86B 100%)', boxShadow: '0 0 80px 24px ' + CREAM(0.32) + ', 0 0 260px 90px ' + GOLD(0.16), animation: 'akariGlow 6s ease-in-out infinite alternate' }, A({ inset: '7%', border: '1px solid ' + GOLD(0.35) })),
        A({ left: 'calc(50% - 1px)', top: '58%', width: 3, height: '34%', background: 'linear-gradient(180deg, #3a342b, #1b1916)' }),
        A({ left: '18%', right: '18%', bottom: '2%', height: '16%', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, ' + GOLD(0.32) + ', ' + NONE + ')', filter: 'blur(16px)' }),
        dust(14, 3, 20, 8, 60, 70)
      ]);
    },
    rim: function () {
      return frame('radial-gradient(70% 60% at 50% 60%, #241f19 0%, #131211 72%)', [
        [12, 80].map(function (l, i) {
          return A({ left: l + '%', top: '8%', width: '8%', height: '70%', borderRadius: 3, background: 'linear-gradient(180deg, #FFF9EA, #EBD49A)', boxShadow: '0 0 50px 12px ' + CREAM(0.3) + ', 0 0 180px 60px ' + GOLD(0.13), animation: 'akariGlow ' + (5 + i) + 's ease-in-out infinite alternate' });
        }),
        A({ left: '20%', right: '20%', top: '30%', bottom: '10%', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, ' + GOLD(0.12) + ', ' + NONE + ')', filter: 'blur(30px)' }),
        dust(10, 9, 25, 15, 50, 60)
      ]);
    },
    flare: function (o) {
      return frame('linear-gradient(180deg, #111111 0%, #1c1914 52%, #111111 100%)', [
        A({ left: '-10%', right: '-10%', top: '50%', height: 80, marginTop: -40, background: 'linear-gradient(90deg, ' + NONE + ', ' + GOLD(0.38) + ' 50%, ' + NONE + ')', filter: 'blur(24px)', animation: 'akariSlide 10s ease-in-out infinite alternate' }),
        A({ left: '-10%', right: '-10%', top: '50%', height: 2, marginTop: -1, background: 'linear-gradient(90deg, ' + NONE + ', ' + CREAM(0.95) + ' 50%, ' + NONE + ')', animation: 'akariSlide 10s ease-in-out infinite alternate' }),
        A({ left: '50%', top: '50%', width: 200, height: 200, margin: '-100px 0 0 -100px', borderRadius: '50%', background: 'radial-gradient(circle, #FFF6DD 0%, ' + CREAM(0.5) + ' 16%, ' + GOLD(0.12) + ' 45%, ' + NONE + ' 70%)', animation: 'akariBreath 4s ease-in-out infinite alternate' }),
        o.hud ? corners('7%', 22, 'rgba(255,255,255,0.55)') : null,
        o.letterbox ? A({ left: 0, right: 0, top: 0, height: '11%', background: '#0B0B0B' }) : null,
        o.letterbox ? A({ left: 0, right: 0, bottom: 0, height: '11%', background: '#0B0B0B' }) : null
      ]);
    },
    bokeh: function (o) {
      var r = rng(o.seed || 11), kids = [];
      for (var i = 0; i < (o.n || 14); i++) {
        var s = 30 + r() * 150, a = 0.1 + r() * 0.32, c = r() > 0.5 ? CREAM : GOLD;
        kids.push(A({ left: (r() * 110 - 10) + '%', top: (r() * 110 - 10) + '%', width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle, ' + c(a) + ' 0%, ' + c(a * 0.7) + ' 58%, ' + c(Math.min(1, a * 1.3)) + ' 66%, ' + NONE + ' 70%)', filter: 'blur(' + (1 + r() * 5) + 'px)', '--dx': (r() * 40 - 20) + 'px', '--dy': (r() * 40 - 20) + 'px', animation: 'akariFloat ' + (8 + r() * 10) + 's ease-in-out ' + (-r() * 10) + 's infinite alternate' }));
      }
      if (o.af) kids.push(A({ left: '50%', top: '50%', width: '24%', aspectRatio: '1', transform: 'translate(-50%,-50%)' }, corners(0, 16, '#D6B86B')));
      return frame('radial-gradient(100% 80% at 40% 40%, #2a2318 0%, #161412 60%, #101010 100%)', kids);
    },
    window: function (o) {
      var grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
      return frame('linear-gradient(180deg, #211d18 0%, #1a1814 60%, #121110 60.3%, #0f0e0d 100%)', [
        A(Object.assign({ left: '12%', top: '10%', width: '32%', height: '42%', gap: 6, background: '#211d18', boxShadow: '0 0 90px 30px ' + CREAM(0.28) + ', 0 0 240px 100px ' + GOLD(0.13) }, grid), panes('linear-gradient(160deg, #FFF8E8, #F2DFAE)')),
        A(Object.assign({ left: '44%', top: '66%', width: '44%', height: '26%', transform: 'skewX(-40deg)', gap: 10, filter: 'blur(4px)', animation: 'akariGlow 9s ease-in-out infinite alternate' }, grid), panes('linear-gradient(160deg, ' + CREAM(0.6) + ', ' + GOLD(0.22) + ')')),
        dust(18, o.flip ? 13 : 5, 20, 15, 60, 70)
      ], o.flip ? { transform: 'scaleX(-1)' } : null);
    },
    aerial: function () {
      return frame('radial-gradient(80% 80% at 50% 50%, #221f1a 0%, #141312 72%)', [
        A({ inset: 0, backgroundImage: 'linear-gradient(' + GOLD(0.07) + ' 1px, transparent 1px), linear-gradient(90deg, ' + GOLD(0.07) + ' 1px, transparent 1px)', backgroundSize: '44px 44px' }),
        A({ inset: '-25%', animation: 'akariSpin 120s linear infinite' }, [0, 1, 2, 3, 4, 5, 6].map(function (i) {
          return A({ left: '50%', top: '50%', width: (14 + i * 12) + '%', aspectRatio: '1.25', transform: 'translate(-50%,-50%) rotate(' + (i * 9) + 'deg)', borderRadius: '47% 53% 50% 50% / 52% 46% 54% 48%', border: '1px solid ' + GOLD(0.5 - i * 0.055) });
        })),
        A({ left: '50%', top: '50%', width: 12, height: 12, margin: -6, borderRadius: '50%', background: '#D6B86B', boxShadow: '0 0 0 6px ' + GOLD(0.18) + ', 0 0 30px ' + GOLD(0.6), animation: 'akariBreath 2.4s ease-in-out infinite alternate' }),
        corners('6%', 20, 'rgba(255,255,255,0.5)')
      ]);
    },
    spot: function () {
      return frame('radial-gradient(70% 60% at 50% 28%, #262119 0%, #121212 72%)', [
        A({ left: '20%', right: '20%', top: '70%', height: '16%', borderRadius: '50%', background: 'radial-gradient(50% 50% at 50% 50%, ' + GOLD(0.42) + ', ' + NONE + ')', filter: 'blur(8px)' }),
        A({ left: '38%', width: '24%', top: '62%', height: '16%', background: 'linear-gradient(90deg, #241f18, #4a3f2e 45%, #241f18)' }),
        A({ left: '50%', top: '62%', width: '14%', aspectRatio: '1', transform: 'translate(-50%, -96%)' }, A({ inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 36% 30%, #FFF6DD 0%, #E9CF8C 18%, #C79B47 45%, #5b4520 80%, #2a2014 100%)', boxShadow: '0 0 60px ' + GOLD(0.3), '--dx': '0px', '--dy': '-12px', animation: 'akariFloat 5s ease-in-out infinite alternate' }))
      ]);
    }
  };

  function buildScene(el) {
    if (!el || el.firstChild) return;
    var make = SCENES[el.getAttribute('data-scene')];
    if (!make) return;
    el.appendChild(make({
      hud: el.hasAttribute('data-hud'),
      letterbox: el.hasAttribute('data-letterbox'),
      af: el.hasAttribute('data-af'),
      flip: el.hasAttribute('data-flip'),
      seed: +el.getAttribute('data-seed') || 0,
      n: +el.getAttribute('data-n') || 0
    }));
  }

  function initMedia() {
    document.querySelectorAll('.media').forEach(function (fig) {
      var img = fig.querySelector('img');
      var scene = fig.querySelector('[data-scene]');
      if (!img) { buildScene(scene); return; }

      function loaded() {
        img.classList.add('is-loaded');
        // La photo couvre la scène : on la retire une fois le fondu terminé.
        if (scene) setTimeout(function () { scene.remove(); }, 700);
      }
      function failed() {
        // Photo indisponible : la scène lumineuse reste affichée à sa place.
        img.hidden = true;
        buildScene(scene);
      }

      if (img.complete) {
        if (img.naturalWidth) loaded(); else failed();
        return;
      }
      buildScene(scene);
      img.addEventListener('load', loaded, { once: true });
      img.addEventListener('error', failed, { once: true });
    });
  }

  /* ---------- Projecteur qui suit la souris ---------- */

  function initSpotlight() {
    if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('[data-spotlight]').forEach(function (sec) {
      var spot = sec.querySelector('.spotlight');
      if (!spot) return;
      sec.addEventListener('mousemove', function (e) {
        var r = sec.getBoundingClientRect();
        spot.style.left = (e.clientX - r.left) + 'px';
        spot.style.top = (e.clientY - r.top) + 'px';
      });
    });
  }

  /* ---------- Filtres de la galerie ---------- */

  function initFilters() {
    var buttons = document.querySelectorAll('[data-filter]');
    if (!buttons.length) return;
    var items = document.querySelectorAll('[data-cat]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        items.forEach(function (it) {
          var show = f === 'all' || it.getAttribute('data-cat') === f;
          var wasHidden = it.hidden;
          it.hidden = !show;
          if (show && wasHidden) reveal.observe(it);
        });
      });
    });
  }

  function init() {
    initMenu();
    initProgress();
    initReveal();
    initMedia();
    if (!reduced) initSpotlight();
    initFilters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
