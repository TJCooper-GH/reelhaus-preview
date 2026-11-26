/* Recreate-page try-it box. Static only: no paid API, no live backend.
   Sample chips render saved breakdowns from the repo. A pasted link is
   validated in the browser, then handed to sign-in with ?url= on /front/moment. */
(function () {
  var root = document.getElementById('try');
  if (!root) return;

  var form = document.getElementById('try-form');
  var input = document.getElementById('try-url');
  var err = document.getElementById('try-err');
  var body = document.getElementById('try-body');
  var cfg = typeof BREAKDOWN_PREVIEW === 'object' && BREAKDOWN_PREVIEW ? BREAKDOWN_PREVIEW : {};

  var BOARD = '../site-v1/images/';

  var SAMPLES = {
    tacos: {
      chip: "Abuela's Tacos",
      kind: 'Saved 9-shot board',
      title: "Abuela's Tacos",
      meta: '16:9 · 9 shots · 00:32',
      badge: 'Real saved board',
      attribution: "Real saved storyboard used on the Reelhaus homepage (Abuela's Tacos, 32 seconds, 9 shots). Shot titles and times are from that board. Hook and beats below are read from those titles and times, not from a separate YouTube analysis.",
      hook: { time: '00:00.0 · 3.0s', text: 'Family intervention — the opening shot on the saved board.' },
      beats: [
        { time: '00:03.0–00:12.2', text: 'Problem: the sad burrito, gas station taco, desk salad, still not it.' },
        { time: '00:12.2 · 10.0s', text: 'Turn: Abuela walks in.' },
        { time: '00:22.3–00:28.3', text: 'Proof: the tacos, then the truck.' },
        { time: '00:28.3 · 4.0s', text: 'Close: Come hungry.' }
      ],
      structure: 'Open on the family, spend the mid-roll on the problem, turn on Abuela, prove with the food and the truck, end on the invite.',
      shots: [
        { n: '01', inn: '00:00.0', dur: '3.0s', title: 'Family intervention', img: BOARD + 'board-1.webp' },
        { n: '02', inn: '00:03.0', dur: '2.0s', title: 'The sad burrito', img: BOARD + 'board-2.webp' },
        { n: '03', inn: '00:05.1', dur: '2.0s', title: 'Gas station taco', img: BOARD + 'board-3.webp' },
        { n: '04', inn: '00:07.1', dur: '2.0s', title: 'Desk salad', img: BOARD + 'board-4.webp' },
        { n: '05', inn: '00:09.2', dur: '3.0s', title: 'Still not it', img: BOARD + 'board-5.webp' },
        { n: '06', inn: '00:12.2', dur: '10.0s', title: 'Abuela walks in', img: BOARD + 'board-6.webp' },
        { n: '07', inn: '00:22.3', dur: '3.0s', title: 'The tacos', img: BOARD + 'board-7.webp' },
        { n: '08', inn: '00:25.3', dur: '3.0s', title: 'The truck', img: BOARD + 'board-8.webp' },
        { n: '09', inn: '00:28.3', dur: '4.0s', title: 'Come hungry', img: BOARD + 'board-9.webp' }
      ]
    },
    ep01: {
      chip: 'EP01 remake',
      kind: 'Saved remake breakdown',
      title: 'EP01 remake — opening window',
      meta: 'First 10 shots · opening ~19s of a 60s window',
      badge: 'Real saved breakdown',
      attribution: "Real saved Reelhaus remake breakdown of TJ's test film EP01.mp4 (Gemini, Nov 6, 2026). Source: docs/study/ep01-remake-breakdown-2026-11-06.md. This is not a public YouTube ad. The list below is the first 10 shots of the opening window; the saved file has 31+ shots across three windows.",
      hook: { time: '00:00.0–00:05.5', text: 'A military launch base in a desert canyon. The control tower explodes as the window opens.' },
      beats: [
        { time: '00:00.0–00:05.5', text: 'Setup: aerial of the canyon base, ground crew at the hangar, the tower blows.' },
        { time: '00:05.5–00:12.1', text: 'Escalation: Cole, a young mechanic, looks up mid-work. Pilots sprint the strip. On-screen: “Hostile mechs inbound.” / “This is not a drill.”' },
        { time: '00:12.1–00:19.1', text: 'Command: radar fills with contacts. The admiral orders a full launch. On-screen: “Launch everything!”' }
      ],
      structure: 'A massive military base launches giant mechs to defend against an incoming surprise assault, while a young mechanic named Cole gets caught on the launch strip. As hostile forces overwhelm defenses and shoot down allied units, a pilot prepares for high-altitude combat; represents the setup and escalation beats.',
      shots: [
        { n: '01', inn: '00:00.0', dur: '1.5s', title: 'EWS aerial — mech silhouette over the canyon launch base' },
        { n: '02', inn: '00:01.5', dur: '1.7s', title: 'MLS low — three ground crew at the hangar' },
        { n: '03', inn: '00:03.2', dur: '2.3s', title: 'MS low — the control tower explodes' },
        { n: '04', inn: '00:05.5', dur: '1.4s', title: 'CU — Cole looks up, shocked' },
        { n: '05', inn: '00:06.9', dur: '2.6s', title: 'WS — pilots sprint the hangar. “Hostile mechs inbound.”' },
        { n: '06', inn: '00:09.5', dur: '2.6s', title: 'WS — lead pilot sprints the launch strip' },
        { n: '07', inn: '00:12.1', dur: '2.1s', title: 'MLS — command bridge, personnel run the consoles' },
        { n: '08', inn: '00:14.2', dur: '1.3s', title: 'Insert — radar fills with hostile contacts' },
        { n: '09', inn: '00:15.5', dur: '1.7s', title: 'MCU — sensor officer warns of incoming contacts' },
        { n: '10', inn: '00:17.2', dur: '1.9s', title: 'MCU — Fleet Admiral: “Launch everything!”' }
      ]
    }
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hideErr() {
    err.hidden = true;
    err.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function showErr(msg) {
    err.hidden = false;
    err.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function validUrl(s) {
    try {
      var u = new URL(s.trim());
      return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname;
    } catch (e) {
      return false;
    }
  }

  function handoffHref(url) {
    var moment = (cfg.momentPath || '/front/moment') + '?url=' + encodeURIComponent(url);
    return (cfg.signIn || 'https://reelhaus.ai/front/signin') + '?next=' + encodeURIComponent(moment);
  }

  function priceChips() {
    var a = esc(cfg.priceLabel || 'Breakdown: free preview');
    var b = esc(cfg.nextPriceLabel || 'Next step: you see the price before it runs');
    return '<div class="try__prices" role="group" aria-label="Price">'
      + '<span class="try__chip try__chip--price">' + a + '</span>'
      + '<span class="try__chip try__chip--price">' + b + '</span>'
      + '<span class="try__price-note">On Studio, after your allowance, a script is $3.50 and a storyboard is $3.50.</span>'
      + '</div>';
  }

  function makeForm(ctaHref, ctaLabel) {
    return '<div class="try__make" id="try-make">'
      + '<button type="button" class="btn btn--ghost" id="try-make-toggle" aria-expanded="false" aria-controls="try-make-fields">Make my version</button>'
      + '<div class="try__make-fields" id="try-make-fields" hidden>'
      + '<p class="try__make-lead">Swap in your own cast, your own story, your own brand. Same ad, different face. Their words, footage and faces stay theirs.</p>'
      + '<label>Your cast <input type="text" name="cast" autocomplete="off" placeholder="Who is on screen in your version"></label>'
      + '<label>Your story <input type="text" name="story" autocomplete="off" placeholder="The story you want to tell"></label>'
      + '<label>Your brand <input type="text" name="brand" autocomplete="off" placeholder="Name, look, or product"></label>'
      + priceChips()
      + '<div class="try__ctas">'
      + '<a class="btn btn--primary btn--lg" href="' + esc(ctaHref) + '">' + esc(ctaLabel) + '</a>'
      + '<a class="btn btn--ghost btn--lg" href="../pricing/index.html#plans">Get Studio</a>'
      + '</div>'
      + '</div></div>';
  }

  function shotRow(s) {
    var thumb = s.img
      ? '<img class="bd-shot__img" src="' + esc(s.img) + '" alt="" width="160" height="90" loading="lazy">'
      : '<span class="bd-shot__ph" aria-hidden="true"></span>';
    return '<li class="bd-shot">'
      + thumb
      + '<span class="bd-shot__n mono">' + esc(s.n) + '</span>'
      + '<span class="bd-shot__t mono">' + esc(s.inn) + ' · ' + esc(s.dur) + '</span>'
      + '<b class="bd-shot__title">' + esc(s.title) + '</b>'
      + '</li>';
  }

  function renderSample(key) {
    var d = SAMPLES[key];
    if (!d) return;
    hideErr();
    root.classList.add('is-open');
    body.hidden = false;
    Array.prototype.forEach.call(root.querySelectorAll('.try__chip[data-sample]'), function (c) {
      c.classList.toggle('is-on', c.getAttribute('data-sample') === key);
    });
    var beats = d.beats.map(function (b) {
      return '<li><span class="mono">' + esc(b.time) + '</span><span>' + esc(b.text) + '</span></li>';
    }).join('');
    body.innerHTML =
      '<div class="bd" data-sample="' + esc(key) + '">'
      + '<header class="bd__head">'
      + '<div><p class="bd__kind">' + esc(d.kind) + '</p><h3 class="bd__title">' + esc(d.title) + '</h3>'
      + '<p class="bd__meta mono">' + esc(d.meta) + '</p></div>'
      + '<span class="bd__badge">' + esc(d.badge) + '</span>'
      + '</header>'
      + '<div class="bd__grid">'
      + '<article class="bd__card"><p class="bd__label">Hook</p><p class="mono bd__time">' + esc(d.hook.time) + '</p><p>' + esc(d.hook.text) + '</p></article>'
      + '<article class="bd__card"><p class="bd__label">Beats</p><ol class="bd__beats">' + beats + '</ol></article>'
      + '<article class="bd__card"><p class="bd__label">Structure</p><p>' + esc(d.structure) + '</p></article>'
      + '</div>'
      + '<h4 class="bd__shots-h">Shot list</h4>'
      + '<ol class="bd-shots">' + d.shots.map(shotRow).join('') + '</ol>'
      + '<p class="bd__attr">' + esc(d.attribution) + '</p>'
      + makeForm('../signup/index.html?next=' + encodeURIComponent('/front/moment?sample=' + key), 'Create an account to make your version')
      + '</div>';
    bindMake();
    body.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function renderSkeleton(url) {
    hideErr();
    root.classList.add('is-open');
    body.hidden = false;
    Array.prototype.forEach.call(root.querySelectorAll('.try__chip[data-sample]'), function (c) {
      c.classList.remove('is-on');
    });
    var steps = [
      'Hook — the opening that stops the scroll',
      'Beats — the turns, with timestamps',
      'Structure — what to keep, not the expression',
      'Shot list — a numbered row for every shot'
    ].map(function (t, i) {
      return '<li class="bd-skel__step"><span class="mono">' + (i + 1) + '</span><span>' + t + '</span><span class="bd-skel__bar" aria-hidden="true"></span></li>';
    }).join('');
    body.innerHTML =
      '<div class="bd bd--skel">'
      + '<header class="bd__head">'
      + '<div><p class="bd__kind">Your link is ready</p><h3 class="bd__title">We’ll break this down after you sign in</h3>'
      + '<p class="bd__meta">Nothing runs on this page. No charge until you approve a step in the studio.</p></div>'
      + '<span class="bd__badge">Free preview, after sign-in</span>'
      + '</header>'
      + '<p class="bd__url mono">' + esc(url) + '</p>'
      + '<ol class="bd-skel">' + steps + '</ol>'
      + '<ol class="bd-shots bd-shots--skel" aria-hidden="true">'
      + '<li class="bd-shot"><span class="bd-shot__ph"></span><span class="bd-shot__n mono">01</span><span class="bd-shot__t mono">00:00.0</span><b class="bd-shot__title bd-shot__title--skel"></b></li>'
      + '<li class="bd-shot"><span class="bd-shot__ph"></span><span class="bd-shot__n mono">02</span><span class="bd-shot__t mono">00:00.0</span><b class="bd-shot__title bd-shot__title--skel"></b></li>'
      + '<li class="bd-shot"><span class="bd-shot__ph"></span><span class="bd-shot__n mono">03</span><span class="bd-shot__t mono">00:00.0</span><b class="bd-shot__title bd-shot__title--skel"></b></li>'
      + '</ol>'
      + makeForm(handoffHref(url), 'Create an account to break this down')
      + '</div>';
    bindMake();
    var toggle = document.getElementById('try-make-toggle');
    if (toggle) toggle.click();
    body.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function bindMake() {
    var t = document.getElementById('try-make-toggle');
    var f = document.getElementById('try-make-fields');
    if (!t || !f) return;
    t.addEventListener('click', function () {
      var open = f.hidden;
      f.hidden = !open;
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = (input.value || '').trim();
    if (!url) {
      showErr('Paste a link to a video you like, or try a sample below.');
      input.focus();
      return;
    }
    if (!validUrl(url)) {
      showErr('Use a full http or https link, then we’ll take you to sign-in with that link saved.');
      input.focus();
      return;
    }
    /* Never call BREAKDOWN_PREVIEW.endpoint from this static page. */
    renderSkeleton(url);
  });

  Array.prototype.forEach.call(root.querySelectorAll('.try__chip[data-sample]'), function (c) {
    c.addEventListener('click', function () {
      renderSample(c.getAttribute('data-sample'));
    });
  });

  var q = new URLSearchParams(location.search).get('sample');
  if (q && SAMPLES[q]) renderSample(q);
})();
