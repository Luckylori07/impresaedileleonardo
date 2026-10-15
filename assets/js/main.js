/* Impresa Edile Leonardo — demo. JavaScript leggero, senza dipendenze. */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Immagini non disponibili: il contenitore mostra il fallback tecnico */
  function markBroken(img) {
    var box = img.closest(".ph");
    if (box) box.classList.add("is-broken");
  }
  document.querySelectorAll(".ph img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) markBroken(img);
    img.addEventListener("error", function () { markBroken(img); });
  });

  /* Header: da trasparente a solido durante lo scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var mq = window.matchMedia("(max-width: 1080px)");

  function setMenuTop() {
    if (!header) return;
    var b = header.getBoundingClientRect().bottom;
    doc.style.setProperty("--menu-top", Math.max(0, Math.round(b)) + "px");
  }
  function openMenu() {
    setMenuTop();
    nav.classList.add("is-open");
    header.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Chiudi il menu");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(returnFocus) {
    if (!nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri il menu");
    document.body.style.overflow = "";
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeMenu(false); else openMenu();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu(true);
    });
    var syncMq = function () {
      if (!mq.matches) closeMenu(false);
      /* Quando il menu è chiuso i link non devono essere raggiungibili da tastiera: lo gestisce visibility */
    };
    if (mq.addEventListener) mq.addEventListener("change", syncMq); else mq.addListener(syncMq);
    window.addEventListener("resize", function () { if (nav.classList.contains("is-open")) setMenuTop(); });
  }

  /* Rivelazioni allo scroll */
  var items = document.querySelectorAll("[data-reveal]");
  if (items.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* Indice servizi: evidenzia la voce visibile */
  var svcLinks = document.querySelectorAll(".svc-nav a");
  if (svcLinks.length && "IntersectionObserver" in window) {
    var map = {};
    svcLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          svcLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add("is-active");
            var list = a.closest("ul");
            if (list && list.scrollWidth > list.clientWidth) {
              list.scrollTo({ left: a.offsetLeft - 24, behavior: reduceMotion ? "auto" : "smooth" });
            }
          }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }
})();
