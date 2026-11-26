/* START-HERE STRIP: drop <div data-start-strip="finder|breakdown|skills|editor|studio"></div>
   at the top of a tool page. One line + one button. The x hides it for good (localStorage).
   Copy and links live in STRIPS below. Needs app.css. */
var STRIPS = {
  finder:    { name:'Discover',      line:'Start with what\'s working: videos beating their channel\'s normal.', button:'Search a niche', href:'https://reelhaus.ai/front/find',
               icon:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>' },
  breakdown: { name:'Break it down', line:'Paste any link. See the hook, the beats and why it worked.', button:'Paste a link',   href:'https://reelhaus.ai/front/breakdown',
               icon:'<path d="M4 6h16M4 12h10M4 18h6"/>' },
  skills:    { name:'Skills',        line:'One-click helpers for common fixes. Try one on your clip.', button:'Pick a skill', href:'https://reelhaus.ai/front/skills',
               icon:'<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>' },
  editor:    { name:'Editor',        line:'Drop in your clips. Cut, caption and export here.',  button:'Add clips',      href:'https://reelhaus.ai/front/timeline',
               icon:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 5v14"/>' },
  studio:    { name:'Studio',        line:'Take a YouTube video from idea to finished cut.',    button:'Start a video',  href:'https://reelhaus.ai/front/youtube',
               icon:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>' }
};
(function(){
  document.querySelectorAll('[data-start-strip]').forEach(function(el){
    var k = el.getAttribute('data-start-strip'), s = STRIPS[k]; if (!s) return;
    var key = 'rh-strip-' + k, gone = false; try { gone = !!localStorage.getItem(key); } catch(e) {}
    if (gone && !el.hasAttribute('data-always')) { el.hidden = true; return; }
    el.className = 'ss'; el.setAttribute('role','region'); el.setAttribute('aria-label', 'Start here: ' + s.name);
    el.innerHTML = '<span class="ss__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + s.icon + '</svg></span>'
      + '<span class="ss__t"><b></b><span></span></span><a class="btn btn--primary"></a>'
      + '<button class="ss__x" type="button" aria-label="Hide this tip">\u00d7</button>';
    el.querySelector('.ss__t b').textContent = s.name;
    el.querySelector('.ss__t span').textContent = s.line;
    var a = el.querySelector('.btn'); a.href = s.href; a.textContent = s.button;
    el.querySelector('.ss__x').addEventListener('click', function(){ el.hidden = true; try { localStorage.setItem(key, '1'); } catch(e) {} });
  });
})();
