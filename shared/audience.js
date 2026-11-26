/* Flow steps: hover/click/scroll a step to change the screen beside it. */
(function(){
  var steps = document.querySelectorAll('.au-step'), img = document.querySelector('.au-flow__vis img'), cap = document.querySelector('.au-flow__cap');
  if (!steps.length || !img) return;
  function on(s){ steps.forEach(function(x){ x.classList.toggle('is-on', x === s); }); img.src = s.dataset.img; if (cap) cap.textContent = 'Step ' + s.dataset.n + ' · ' + s.dataset.cap; }
  steps.forEach(function(s){ s.addEventListener('mouseenter', function(){ on(s); }); s.addEventListener('click', function(){ on(s); }); s.addEventListener('focus', function(){ on(s); }); s.tabIndex = 0; });
  on(steps[0]);
})();
