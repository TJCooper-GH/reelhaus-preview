/* Shared behaviour: media slots, Black Friday banner + popup, theme toggle. */
(function(){
  var d = document, q = new URLSearchParams(location.search);

  /* media slots: <figure data-media="key"> */
  d.querySelectorAll('[data-media]').forEach(function(el){
    var m = (typeof MEDIA !== 'undefined') && MEDIA[el.getAttribute('data-media')]; if (!m) return;
    var img = d.createElement('img'); img.src = m.poster; img.alt = ''; el.appendChild(img);
    if (m.video) {
      var v = d.createElement('video'); v.src = m.video; v.poster = m.poster; v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline',''); v.autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches; el.appendChild(v);
    } else {
      var t = d.createElement('span'); t.className = 'lp-ph'; t.textContent = 'Placeholder · ' + m.label; el.appendChild(t);
    }
  });

  /* checkout links: <a data-checkout="studio_month"> */
  d.querySelectorAll('[data-checkout]').forEach(function(a){
    if (typeof CHECKOUT !== 'undefined' && CHECKOUT[a.getAttribute('data-checkout')]) a.href = CHECKOUT[a.getAttribute('data-checkout')];
  });

  /* theme (in-app pages only): <html data-themeable>. ?theme=light|dark wins, then saved, then system. */
  if (d.documentElement.hasAttribute('data-themeable')) {
    var saved = null; try { saved = localStorage.getItem('rh-theme'); } catch(e) {}
    var t = q.get('theme') || saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    function apply(x){ d.documentElement.dataset.theme = x;
      d.querySelectorAll('[data-theme-toggle]').forEach(function(b){ b.setAttribute('aria-pressed', x === 'dark'); b.setAttribute('aria-label', x === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }); }
    apply(t);
    d.addEventListener('click', function(e){ var b = e.target.closest('[data-theme-toggle]'); if (!b) return;
      var n = d.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; apply(n); try { localStorage.setItem('rh-theme', n); } catch(e) {} });
  }

  /* Black Friday: copied from the homepage mechanism (build-v2/site.js). Pages opt in with <body data-bf>. */
  if (typeof BF === 'undefined' || !d.body.hasAttribute('data-bf')) return;
  var now = q.get('bfnow') ? new Date(q.get('bfnow')).getTime() : Date.now();
  if (!(now <= new Date(BF.endsAt).getTime())) return;
  var bn = d.createElement('div');
  bn.className = 'bfb'; bn.setAttribute('role','region'); bn.setAttribute('aria-label','Black Friday offer');
  bn.innerHTML = '<span class="bfb__long"></span><span class="bfb__short"></span><a class="bfb__go"></a>';
  bn.querySelector('.bfb__long').textContent = BF.banner;
  bn.querySelector('.bfb__short').textContent = BF.bannerShort;
  var go = bn.querySelector('.bfb__go'); go.href = BF.checkoutUrl; go.innerHTML = '<span class="bfb__gl"></span><span class="bfb__gs"></span> \u2192';
  go.querySelector('.bfb__gl').textContent = BF.button; go.querySelector('.bfb__gs').textContent = BF.bannerLink || BF.button;
  d.body.insertBefore(bn, d.body.firstChild);
  d.documentElement.classList.add('bf-on');
  d.querySelectorAll('[data-bf-only]').forEach(function(el){ el.hidden = false; });

  var seen = false; try { seen = !!localStorage.getItem(BF.storageKey); } catch(e) {}
  if (seen && q.get('bfpop') !== '1') return;
  var phone = matchMedia('(max-width: 860px)').matches, scrolled = false, shown = false, timer = null, last = null;
  function remember(){ try { localStorage.setItem(BF.storageKey, String(Date.now())); } catch(e) {} }
  function show(){
    if (shown) return; shown = true; remember(); removeEventListener('scroll', onScroll); last = d.activeElement;
    var w = d.createElement('div'); w.className = 'bfp';
    w.innerHTML = '<div class="bfp__back" data-x></div><div class="bfp__card" role="dialog" aria-modal="true" aria-labelledby="bfp-t">'
      + '<button class="bfp__x" type="button" aria-label="Close" data-x>\u00d7</button>'
      + '<p class="bfp__tag">Ends Dec 1</p><h2 id="bfp-t" class="bfp__t"></h2><p class="bfp__b"></p>'
      + '<a class="btn btn--primary bfp__go"></a><button class="bfp__no" type="button" data-x>No thanks</button></div>';
    w.querySelector('.bfp__t').textContent = BF.popupTitle;
    w.querySelector('.bfp__b').textContent = BF.popupBody;
    var a = w.querySelector('.bfp__go'); a.href = BF.checkoutUrl; a.textContent = BF.button;
    d.body.appendChild(w); requestAnimationFrame(function(){ w.classList.add('is-open'); });
    w.querySelector('.bfp__x').focus({preventScroll:true});
    function close(){ remember(); w.classList.remove('is-open'); d.removeEventListener('keydown', key);
      setTimeout(function(){ w.remove(); }, 250); if (last && last.focus) last.focus({preventScroll:true}); }
    function key(e){
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') { var f = w.querySelectorAll('button,a'), first = f[0], end = f[f.length-1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); end.focus(); }
        else if (!e.shiftKey && d.activeElement === end) { e.preventDefault(); first.focus(); } }
    }
    w.addEventListener('click', function(e){ if (e.target.closest('[data-x]')) close(); });
    d.addEventListener('keydown', key);
  }
  function frac(){ var h = d.documentElement.scrollHeight - innerHeight; return h > 0 ? scrollY / h : 0; }
  function arm(){ if (!timer) timer = setTimeout(show, q.get('bfpop') === '1' ? 300 : BF.popupDelayMs); }
  function onScroll(){ if (!scrolled) { scrolled = true; if (phone) arm(); } if (frac() >= BF.popupScroll) show(); }
  addEventListener('scroll', onScroll, {passive:true});
  if (!phone || q.get('bfpop') === '1') arm();
})();
