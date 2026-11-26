/* ==========================================================================
   BLACK FRIDAY: the only seasonal thing on the page. A thin top banner and a
   one-time popup, both built from this block. After BF.endsAt they never render
   and the page is the evergreen homepage, untouched. Delete this block (and the
   BF section at the bottom of this file) once it's over, or just let it expire.
   Test the expired state with ?bfnow=2026-12-02T12:00:00-08:00 in the URL.
   ========================================================================== */
var BF = {
  endsAt: '2026-12-01T23:59:59-08:00',   // Dec 1, 2026, 11:59 PM PT. Nothing shows after this.
  checkoutUrl: 'https://whop.com/checkout/plan_Pr12zNX5p3GUt',  // Studio yearly (matches launch-pages/shared/config.js CHECKOUT.studio_year)
  banner: 'Black Friday: Studio yearly $990, two months free, plus a 5-skill pack and +50 searches a month for 3 months. Ends Dec 1.',
  bannerShort: 'Black Friday: Studio yearly $990',   // narrow screens
  bannerLink: 'Get the deal',                         // banner link text on phones
  popupTitle: 'Black Friday',
  popupBody: 'Studio yearly $990, two months free, plus a 5-skill pack and +50 searches a month for 3 months. Ends Dec 1.',
  button: 'Get the Black Friday deal',
  popupDelayMs: 8000,      // or 40% of the page scrolled, whichever comes first
  popupScroll: 0.40,
  storageKey: 'rh-bf26-popup'
};
/* ======================================================================== */

/* ==========================================================================
   MEDIA CONFIG: every video on the homepage lives here.
   None of these clips are final. To drop in a real clip made in the tool:
     1. Put the file anywhere under /workspace/homepage-scroll/ (e.g. media/).
     2. Change the path below (relative to this build-v2 folder).
     3. Reload. No HTML edits needed.
   desktop = 16:9 file, mobile = 9:16 file (phones under 860px get this one),
   poster  = still shown before the clip loads and under reduced motion.
   Keep clips muted (no audio track needed). Scrub clips scroll frame by frame,
   so encode them with a dense keyframe interval, for example:
     ffmpeg -i in.mp4 -an -c:v libx264 -crf 22 -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart out.mp4
   ========================================================================== */
var MEDIA = {
  // Hero sizzle: plays on its own, muted, looping. 15 to 25 seconds is plenty.
  heroReel: {
    desktop: 'site-v1/assets/sizzle.mp4',        // PLACEHOLDER: test cuts, replace with the real sizzle
    mobile:  'site-v1/assets/sizzle-m.mp4',      // PLACEHOLDER
    poster:  'site-v1/assets/sizzle-poster.jpg',
    posterMobile: 'site-v1/assets/sizzle-poster-m.jpg'
  },
  // Story film under "You have the idea...": scrubbed by scroll (about 30 seconds).
  // Desktop file keeps the subject on the RIGHT third; the copy sits on the left.
  storyFilm: {
    desktop: 'site-v1/assets/ready.mp4',         // PLACEHOLDER
    mobile:  'site-v1/assets/ready-m.mp4',       // PLACEHOLDER
    poster:  'site-v1/assets/ready-poster.jpg',
    posterMobile: 'site-v1/assets/ready-poster-m.jpg'
  },
  // Storyboard contact sheet: 9 stills, in shot order (16:9). Shot names and
  // timecodes are in index.html under <section class="snap">.
  boardFrames: [
    'site-v1/images/board-1.webp', 'site-v1/images/board-2.webp', 'site-v1/images/board-3.webp',
    'site-v1/images/board-4.webp', 'site-v1/images/board-5.webp', 'site-v1/images/board-6.webp',
    'site-v1/images/board-7.webp', 'site-v1/images/board-8.webp', 'site-v1/images/board-9.webp'
  ]
};
/* ======================================================================== */

(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = matchMedia('(max-width: 860px)').matches;

  // Wire MEDIA into the page (before the scroll engine mounts and reads data-sc-src).
  function pick(m, k){ return mobile && m[k + 'Mobile'] ? m[k + 'Mobile'] : m[k]; }
  Array.prototype.forEach.call(document.querySelectorAll('video[data-media]'), function (el) {
    var m = MEDIA[el.getAttribute('data-media')]; if (!m) return;
    el.poster = pick(m, 'poster');
    if (el.hasAttribute('data-sc-scrub')) { el.setAttribute('data-sc-src', m.desktop); el.setAttribute('data-sc-src-mobile', m.mobile); }
    else { el.dataset.src = m.desktop; el.dataset.srcMobile = m.mobile; }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-media-poster]'), function (el) {
    var m = MEDIA[el.getAttribute('data-media-poster')]; if (m) el.src = pick(m, 'poster');
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-media-board]'), function (el) {
    var f = MEDIA.boardFrames[+el.getAttribute('data-media-board')]; if (f) el.src = f;
  });

  // Receipt: 8 strips. Strip 0 is the readable one; the copies are decoration.
  var src = document.querySelector('.rc__strip');
  if (src) {
    for (var j = 1; j < 8; j++) {
      var c = src.cloneNode(true);
      c.style.setProperty('--j', j);
      c.setAttribute('aria-hidden', 'true');
      var r = c.querySelector('#receipt'); if (r) r.removeAttribute('id');
      src.parentNode.appendChild(c);
    }
  }

  // Sizzle: plays muted on its own; reduced motion leaves it on the poster until asked.
  var v = document.getElementById('sizzle'), btn = document.getElementById('sizzleToggle');
  if (v) {
    var loaded = false;
    function load(){ if (loaded) return; loaded = true; v.src = mobile ? v.dataset.srcMobile : v.dataset.src; }
    function play(){ load(); var p = v.play(); if (p && p.catch) p.catch(function(){}); btn.textContent = 'Pause'; btn.setAttribute('aria-pressed','false'); }
    function pause(){ v.pause(); btn.textContent = 'Play'; btn.setAttribute('aria-pressed','true'); }
    if (reduce) { btn.textContent = 'Play'; btn.setAttribute('aria-pressed','true'); } else { play(); }
    btn.addEventListener('click', function(){ (v.paused || !loaded) ? play() : pause(); });
  }

  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  // Walkthrough: act progress picks the step. State change, crossfaded.
  var walk = document.querySelector('.walk');
  if (walk) {
    var chips = walk.querySelectorAll('.walk__chips li'), steps = walk.querySelectorAll('.step'), shots = walk.querySelectorAll('.walk__screens img');
    var n = steps.length, cur = -1;
    function set(i){
      if (i === cur) return; cur = i;
      for (var k = 0; k < n; k++) {
        steps[k].classList.toggle('on', k === i); shots[k].classList.toggle('on', k === i);
        chips[k].classList.toggle('on', k === i); chips[k].classList.toggle('done', k < i);
        steps[k].setAttribute('aria-hidden', k === i ? 'false' : 'true');
      }
    }
    set(0);
    (function tick(){
      var p = parseFloat(getComputedStyle(walk).getPropertyValue('--sc-p')) || 0;
      var i = Math.min(n - 1, Math.max(0, Math.floor((p - 0.04) / 0.9 * n)));
      set(i);
      requestAnimationFrame(tick);
    })();
  }
})();

/* ---- BLACK FRIDAY (banner + popup, driven by BF config at the top) ---- */
(function(){
  if (typeof BF === 'undefined') return;
  var q = new URLSearchParams(location.search);
  var now = q.get('bfnow') ? new Date(q.get('bfnow')).getTime() : Date.now();
  if (!(now <= new Date(BF.endsAt).getTime())) return;   // expired: render nothing
  var d = document;

  // banner
  var bn = d.createElement('div');
  bn.className = 'bfb'; bn.setAttribute('role','region'); bn.setAttribute('aria-label','Black Friday offer');
  bn.innerHTML = '<span class="bfb__long"></span><span class="bfb__short"></span><a class="bfb__go"></a>';
  bn.querySelector('.bfb__long').textContent = BF.banner;
  bn.querySelector('.bfb__short').textContent = BF.bannerShort;
  var go = bn.querySelector('.bfb__go'); go.href = BF.checkoutUrl; go.innerHTML = '<span class="bfb__gl"></span><span class="bfb__gs"></span> \u2192';
  go.querySelector('.bfb__gl').textContent = BF.button; go.querySelector('.bfb__gs').textContent = BF.bannerLink;
  d.body.insertBefore(bn, d.body.firstChild);
  d.documentElement.classList.add('bf-on');

  // popup: once per visitor
  var seen = false; try { seen = !!localStorage.getItem(BF.storageKey); } catch(e) {}
  if (seen && q.get('bfpop') !== '1') return;
  var phone = matchMedia('(max-width: 860px)').matches;
  var scrolled = false, shown = false, timer = null, last = null;
  function remember(){ try { localStorage.setItem(BF.storageKey, String(Date.now())); } catch(e) {} }
  function show(){
    if (shown) return; shown = true; remember();
    removeEventListener('scroll', onScroll);
    last = d.activeElement;
    var w = d.createElement('div'); w.className = 'bfp'; 
    w.innerHTML = '<div class="bfp__back" data-x></div><div class="bfp__card" role="dialog" aria-modal="true" aria-labelledby="bfp-t">'
      + '<button class="bfp__x" type="button" aria-label="Close" data-x>\u00d7</button>'
      + '<p class="bfp__tag">Ends Dec 1</p><h2 id="bfp-t" class="bfp__t"></h2><p class="bfp__b"></p>'
      + '<a class="btn btn--primary bfp__go"></a><button class="bfp__no" type="button" data-x>No thanks</button></div>';
    w.querySelector('.bfp__t').textContent = BF.popupTitle;
    w.querySelector('.bfp__b').textContent = BF.popupBody;
    var a = w.querySelector('.bfp__go'); a.href = BF.checkoutUrl; a.textContent = BF.button;
    d.body.appendChild(w);
    requestAnimationFrame(function(){ w.classList.add('is-open'); });
    w.querySelector('.bfp__x').focus({preventScroll:true});
    function close(){ remember(); w.classList.remove('is-open'); d.removeEventListener('keydown', key);
      setTimeout(function(){ w.remove(); }, 250); if (last && last.focus) last.focus({preventScroll:true}); }
    function key(e){
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') { var f = w.querySelectorAll('button,a'); var first = f[0], end = f[f.length-1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); end.focus(); }
        else if (!e.shiftKey && d.activeElement === end) { e.preventDefault(); first.focus(); } }
    }
    w.addEventListener('click', function(e){ if (e.target.closest('[data-x]')) close(); });
    d.addEventListener('keydown', key);
  }
  function frac(){ var h = d.documentElement.scrollHeight - innerHeight; return h > 0 ? scrollY / h : 0; }
  function arm(){ if (!timer) timer = setTimeout(show, BF.popupDelayMs); }
  function onScroll(){
    if (!scrolled) { scrolled = true; if (phone) arm(); }
    if (frac() >= BF.popupScroll) show();
  }
  addEventListener('scroll', onScroll, {passive:true});
  if (!phone) arm();               // phones wait for the first scroll
})();

/* ---- Hero chat teaser: types a few real-sounding prompts; nav firms up on scroll ---- */
(function(){
  var bar = document.querySelector('.bar');
  function onS(){ if (bar) bar.classList.toggle('is-scrolled', scrollY > 8); }
  addEventListener('scroll', onS, {passive:true}); onS();
  var el = document.querySelector('[data-typer]');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lines = [
    "A 30-second ad for my aunt's taco truck",
    "Paste a link: remake this hook in my niche",
    "A 5-part short drama, same cast every episode",
    "A 10-minute history video, facts checked"
  ];
  var i = 0, n = lines[0].length, del = false;
  function tick(){
    var t = lines[i];
    if (!del) { n++; if (n > t.length) { del = true; return setTimeout(tick, 2600); } }
    else { n -= 2; if (n <= 0) { del = false; n = 0; i = (i + 1) % lines.length; } }
    el.textContent = lines[i].slice(0, Math.max(0, n));
    setTimeout(tick, del ? 18 : 42);
  }
  setTimeout(function(){ del = true; tick(); }, 7000);
})();
