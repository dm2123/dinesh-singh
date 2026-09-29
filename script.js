// Dinesh Singh site — starfield, 3D tilt, scroll reveal (lightweight)
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- starfield (cheap: ~70 particles, rAF, pauses when hidden) ---- */
  var canvas = document.getElementById("stars");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var W, H, stars = [], running = true;
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function seed() {
      stars = [];
      var n = Math.min(90, Math.floor((W * H) / 16000));
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.4,
          s: Math.random() * 0.25 + 0.05,
          tw: Math.random() * Math.PI * 2,
          c: Math.random() < 0.25 ? "63,185,80" : (Math.random() < 0.5 ? "57,208,216" : "230,237,243")
        });
      }
    }
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var p = stars[i];
        p.y -= p.s; if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        p.tw += 0.03;
        var a = 0.35 + 0.35 * Math.sin(p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(2) + ")";
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    resize(); seed(); tick();
    window.addEventListener("resize", function () { resize(); seed(); });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
  }

  /* ---- 3D tilt on cards (desktop pointers only) ---- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (px * 10).toFixed(2) + "deg)" +
          " rotateX(" + (-py * 10).toFixed(2) + "deg) translateZ(6px)";
        card.querySelector(".card-glow").style.setProperty("--gx", ((px + 0.5) * 100) + "%");
        card.querySelector(".card-glow").style.setProperty("--gy", ((py + 0.5) * 100) + "%");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
        card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
        setTimeout(function () { card.style.transition = ""; }, 460);
      });
    });

    /* ---- hero parallax: avatar tilts toward cursor ---- */
    var hero = document.getElementById("hero");
    var wrap = document.getElementById("avatarWrap");
    if (hero && wrap) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        wrap.style.transform = "rotateY(" + (px * 14).toFixed(2) + "deg) rotateX(" + (-py * 14).toFixed(2) + "deg)";
        wrap.style.animation = "none";
      });
      hero.addEventListener("mouseleave", function () {
        wrap.style.transform = "";
        wrap.style.animation = "";
      });
    }
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
