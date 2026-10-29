/* ==========================================================================
   Valerie Shirayuri: portfolio
   Everything you are likely to edit is in the SETTINGS block right below.
   ========================================================================== */
(function () {
  'use strict';

  /* ===== SETTINGS ===== */

  // The work list itself is in work.js. Add to it with:
  //   node add-work.mjs photo pictures/valerie/bird.jpg "a caption"
  // (or video / school — see work.js).
  var PHOTOS = window.WORK || [];

  // Used only if work.js is empty: your Instagram feed, via LightWidget.
  var LIGHTWIDGET_ID = '6195efb0fa4857e1af8bc031a2252235';

  var VIDEO_FILE = /\.(mp4|webm|mov|m4v|ogv)$/i;

  /* ===== small helpers ===== */
  function $(id) { return document.getElementById(id); }
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== light / dark ===== */
  /* The page starts on the system setting (set in index.html before paint).
     The button overrides that, and the choice is remembered. */
  var root = document.documentElement;
  var themeBtn = $('theme');
  var systemLight = window.matchMedia ? matchMedia('(prefers-color-scheme: light)') : null;
  var THEME_COLORS = { dark: '#171019', light: '#fdf6fb' };

  function applyTheme(theme, remember) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (remember) {
      try { localStorage.setItem('vs-theme', theme); } catch (e) {}
    }
  }

  function savedTheme() {
    try { return localStorage.getItem('vs-theme'); } catch (e) { return null; }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    });
    applyTheme(root.getAttribute('data-theme') || 'dark', false);
  }

  // if nobody picked a side, keep following the system as it changes
  if (systemLight) {
    var onSystemChange = function (e) {
      var saved = savedTheme();
      if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark', false);
    };
    if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);
    else if (systemLight.addListener) systemLight.addListener(onSystemChange);
  }

  /* ===== footer year ===== */
  $('year').textContent = new Date().getFullYear();

  /* ===== fade sections in as they scroll into view ===== */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ===== highlight the menu link for the section you are reading ===== */
  var links = document.querySelectorAll('[data-nav]');
  var sections = [];
  links.forEach(function (a) {
    var s = document.getElementById(a.dataset.nav);
    if (s) sections.push(s);
  });

  function markActive(id) {
    links.forEach(function (a) {
      a.classList.toggle('active', a.dataset.nav === id);
    });
  }

  if (sections.length) {
    var ticking = false;
    function updateActive() {
      ticking = false;
      var line = window.scrollY + window.innerHeight * 0.35;
      var current = null;
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top + window.scrollY <= line) current = s.id;
      });
      // at the bottom of a scrollable page the last section can never reach the line
      var page = document.documentElement;
      if (page.scrollHeight > window.innerHeight + 8 &&
          window.innerHeight + window.scrollY >= page.scrollHeight - 4) {
        current = sections[sections.length - 1].id;
      }
      markActive(current);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateActive); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActive();
  }

  /* ===== projects: the code half of the portfolio ===== */
  var projGrid = $('projgrid');
  if (projGrid && window.PROJECTS) {
    PROJECTS.forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'proj';
      a.href = p.href;
      if (/^https?:/i.test(p.href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      var name = document.createElement('h3');
      name.textContent = p.name + ' ';
      var arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '\u2197';
      name.appendChild(arrow);

      var desc = document.createElement('p');
      desc.textContent = p.desc || '';

      var tech = document.createElement('span');
      tech.className = 'tech';
      tech.textContent = p.tech || '';

      a.append(name, desc, tech);
      projGrid.appendChild(a);
    });
  }

  /* ===== work: my photos and videos, or the Instagram feed ===== */
  var gallery = $('gallery');
  var feed = $('feed');
  var filters = $('filters');
  var empty = $('work-empty');
  var pictureLinks = []; // only pictures open in the big viewer

  function tagsOf(item) {
    var t = item.tags || item.tag || 'photo';
    return Array.isArray(t) ? t : [t];
  }

  if (PHOTOS.length) {
    if (filters) filters.hidden = false;

    PHOTOS.forEach(function (p, i) {
      var isVideo = tagsOf(p).indexOf('video') !== -1 || VIDEO_FILE.test(p.src);
      var fig = document.createElement('figure');
      fig.dataset.tags = tagsOf(p).join(' ');

      var media;
      if (isVideo) {
        media = document.createElement('video');
        media.src = p.src;
        media.controls = true;
        media.preload = 'metadata';
        media.playsInline = true;
        fig.classList.add('has-video');
      } else {
        media = document.createElement('img');
        media.src = p.src;
        media.alt = p.alt || '';
        media.loading = 'lazy';
        media.decoding = 'async';
        media.width = 1600;
        media.height = 1067;
      }
      fig.appendChild(media);

      if (p.caption) {
        var cap = document.createElement('figcaption');
        cap.textContent = p.caption;
        fig.appendChild(cap);
      }

      if (!isVideo) {
        var picIndex = pictureLinks.length;
        pictureLinks.push(p);
        fig.tabIndex = 0;
        fig.setAttribute('role', 'button');
        fig.setAttribute('aria-label', 'Open photo ' + (i + 1) + (p.alt ? ': ' + p.alt : ''));
        fig.addEventListener('click', function () { openLb(picIndex); });
        fig.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(picIndex); }
        });
      }

      gallery.appendChild(fig);
    });

    // the filter buttons
    var chips = document.querySelectorAll('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        var want = chip.dataset.filter;
        var shown = 0;
        gallery.querySelectorAll('figure').forEach(function (fig) {
          var match = want === 'all' || fig.dataset.tags.split(' ').indexOf(want) !== -1;
          fig.hidden = !match;
          if (match) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  } else if (LIGHTWIDGET_ID) {
    var frame = document.createElement('iframe');
    frame.src = 'https://lightwidget.com/widgets/' + LIGHTWIDGET_ID + '.html';
    frame.title = 'Valerie on Instagram';
    frame.loading = 'lazy';
    frame.setAttribute('allowtransparency', 'true');
    frame.setAttribute('scrolling', 'no');
    feed.appendChild(frame);
    feed.hidden = false;
  }

  /* ===== photo viewer ===== */
  var lb = $('lb');
  var lbImg = $('lbImg');
  var cur = 0;

  function show(i) {
    cur = (i + pictureLinks.length) % pictureLinks.length;
    lbImg.src = pictureLinks[cur].src;
    lbImg.alt = pictureLinks[cur].alt || '';
  }
  function openLb(i) {
    show(i);
    if (typeof lb.showModal === 'function') lb.showModal();
    else lb.setAttribute('open', '');
  }
  function closeLb() {
    if (typeof lb.close === 'function') lb.close();
    else lb.removeAttribute('open');
  }
  $('lbClose').addEventListener('click', closeLb);
  $('lbPrev').addEventListener('click', function () { show(cur - 1); });
  $('lbNext').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.hasAttribute('open')) return;
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  if (pictureLinks.length < 2) {
    $('lbPrev').hidden = true;
    $('lbNext').hidden = true;
  }
})();
