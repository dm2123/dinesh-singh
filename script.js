// Dinesh Singh site — floating cartoon shapes + scroll reveal (lightweight)
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- floating cartoon emoji shapes (cheap DOM animation, pauses when hidden) ---- */
  var box = document.getElementById("floaties");
  if (box && !reduceMotion) {
    var EMOJIS = ["\u{1F3AC}", "\u2B50", "\u{1F602}", "\u{1F388}", "\u{1F981}", "\u{1F49B}", "\u2728", "\u{1F3A8}"];
    var running = true;
    function spawn() {
      if (!running || document.hidden) return;
      // keep the party small: max ~14 floaties at once
      if (box.childNodes.length < 14 && Math.random() < 0.6) {
        var s = document.createElement("span");
        s.className = "floaty";
        s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        var size = 18 + Math.random() * 26;
        s.style.fontSize = size + "px";
        s.style.left = (Math.random() * 96) + "vw";
        s.style.animationDuration = (9 + Math.random() * 9) + "s";
        box.appendChild(s);
        s.addEventListener("animationend", function () { s.remove(); });
      }
      setTimeout(spawn, 900 + Math.random() * 1400);
    }
    spawn();
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) spawn();
    });
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("revealed"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }
})();
