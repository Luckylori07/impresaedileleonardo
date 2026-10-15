/* Pagina Progetti: filtri per categoria e lightbox accessibile */
(function () {
  "use strict";

  /* Filtri */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var chips = group.querySelectorAll(".chip");
    var items = group.querySelectorAll(".gallery__item");
    var counter = group.querySelector("[data-count]");
    var empty = group.querySelector(".gallery-empty");

    function apply(cat) {
      var shown = 0;
      items.forEach(function (it) {
        var ok = cat === "tutti" || it.getAttribute("data-cat") === cat;
        it.hidden = !ok;
        if (ok) shown++;
      });
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === cat));
      });
      if (counter) counter.textContent = shown + (shown === 1 ? " immagine" : " immagini");
      if (empty) empty.hidden = shown !== 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.getAttribute("data-cat")); });
    });
    apply("tutti");
  });

  /* Lightbox */
  var dlg = document.getElementById("lightbox");
  if (!dlg || typeof dlg.showModal !== "function") return;
  var img = dlg.querySelector("img");
  var cap = dlg.querySelector(".lightbox__cap");
  var BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var list = [];
  var idx = 0;
  var opener = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    var b = list[idx];
    img.src = b.getAttribute("data-full");
    img.alt = b.getAttribute("data-alt") || "";
    cap.textContent = b.getAttribute("data-caption") || "";
  }
  function open(btn) {
    var group = btn.closest("[data-filter-group]");
    list = Array.prototype.filter.call(group.querySelectorAll(".gallery__btn"), function (b) {
      return !b.closest(".gallery__item").hidden;
    });
    opener = btn;
    show(list.indexOf(btn));
    dlg.showModal();
  }
  document.querySelectorAll(".gallery__btn").forEach(function (b) {
    b.addEventListener("click", function () { open(b); });
  });
  dlg.querySelector(".lightbox__prev").addEventListener("click", function () { show(idx - 1); });
  dlg.querySelector(".lightbox__next").addEventListener("click", function () { show(idx + 1); });
  dlg.querySelector(".lightbox__close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  dlg.addEventListener("close", function () {
    img.src = BLANK;
    if (opener) opener.focus();
  });
})();
