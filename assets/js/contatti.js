/*
 * Modulo di richiesta preventivo.
 * - Validazione lato client con messaggi chiari.
 * - Modalità "mailto" (predefinita): prepara un'email e la apre nel programma di posta.
 *   Non viene mai mostrata una conferma di invio, perché il sito non può saperlo.
 * - Modalità "endpoint": se in config.js è impostato formEndpoint, invia con fetch e
 *   mostra la conferma solo se il servizio risponde con successo.
 */
(function () {
  "use strict";

  var form = document.getElementById("quote-form");
  if (!form) return;
  var cfg = window.LEONARDO_CONFIG || {};
  var recipient = cfg.recipientEmail || "info@impresaedileleonardo.com";
  var endpoint = (cfg.formEndpoint || "").trim();
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  var rules = {
    nome: function (v) {
      if (!v) return "Inserisci il tuo nome e cognome.";
      if (v.split(/\s+/).filter(Boolean).length < 2) return "Indica sia il nome sia il cognome.";
      return "";
    },
    email: function (v) {
      if (!v) return "Inserisci il tuo indirizzo email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "L'indirizzo email non sembra corretto. Esempio: nome@dominio.it";
      return "";
    },
    telefono: function (v) {
      if (!v) return "";
      var digits = v.replace(/\D/g, "");
      if (!/^[+\d\s().\-\/]+$/.test(v) || digits.length < 6 || digits.length > 15) return "Il numero di telefono non sembra corretto. Esempio: +39 338 000 0000";
      return "";
    },
    comune: function (v) { return v.length < 2 ? "Indica il comune in cui si trova l'immobile." : ""; },
    tipologia: function (v) { return v ? "" : "Scegli la tipologia di intervento."; },
    messaggio: function (v) {
      if (!v) return "Descrivi brevemente l'intervento che ti interessa.";
      if (v.length < 10) return "Aggiungi qualche dettaglio in più (almeno 10 caratteri).";
      return "";
    },
    privacy: function (v, el) { return el.checked ? "" : "Per procedere devi accettare l'informativa sulla privacy."; }
  };

  function fieldOf(el) { return el.closest(".field"); }
  function setState(el, msg) {
    var f = fieldOf(el);
    var out = f.querySelector(".field__error span");
    f.classList.toggle("is-invalid", !!msg);
    f.classList.toggle("is-valid", !msg && !!(el.type === "checkbox" ? el.checked : el.value.trim()));
    if (out) out.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function check(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var msg = rule(el.type === "checkbox" ? "" : el.value.trim(), el);
    setState(el, msg);
    return !msg;
  }

  var touched = {};
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    if (!rules[el.name]) return;
    el.addEventListener("blur", function () { touched[el.name] = true; check(el); });
    var ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ev, function () { if (touched[el.name] || fieldOf(el).classList.contains("is-invalid")) check(el); });
  });

  /* Preselezione del servizio da ?servizio=… */
  try {
    var wanted = new URLSearchParams(window.location.search).get("servizio");
    var sel = form.elements.tipologia;
    if (wanted && sel) {
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === wanted) sel.value = wanted; });
    }
  } catch (e) { /* ignora */ }

  function collect() {
    var d = {};
    ["nome", "email", "telefono", "comune", "tipologia", "messaggio"].forEach(function (k) {
      d[k] = form.elements[k].value.trim();
    });
    return d;
  }
  function buildText(d) {
    return [
      "Richiesta di preventivo / sopralluogo",
      "",
      "Nome e cognome: " + d.nome,
      "Email: " + d.email,
      "Telefono: " + (d.telefono || "non indicato"),
      "Comune dell'immobile: " + d.comune,
      "Tipologia di intervento: " + d.tipologia,
      "",
      "Messaggio:",
      d.messaggio,
      "",
      "Ho letto l'informativa sulla privacy e acconsento al trattamento dei dati per rispondere alla richiesta."
    ].join("\n");
  }
  function mailtoHref(d) {
    var subject = "Richiesta preventivo — " + d.tipologia + " — " + d.comune;
    return "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildText(d).replace(/\n/g, "\r\n"));
  }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }
  function showStatus(kind, title, paragraphs, extra) {
    status.hidden = false;
    status.className = "form-status form-status--" + kind;
    status.textContent = "";
    status.appendChild(el("h3", {}, title));
    paragraphs.forEach(function (p) { status.appendChild(el("p", {}, p)); });
    if (extra) extra(status);
    status.setAttribute("tabindex", "-1");
    status.focus({ preventScroll: false });
  }

  function mailtoFlow(d) {
    var href = mailtoHref(d);
    var text = buildText(d);
    showStatus("pending", "Richiesta pronta: manca solo l'invio dalla tua email", [
      "Abbiamo aperto il tuo programma di posta con il messaggio già compilato, indirizzato a " + recipient + ". Controlla il testo e premi Invia.",
      "Finché non lo fai la richiesta non è stata inviata. Questo sito dimostrativo non conserva né trasmette i dati inseriti."
    ], function (box) {
      var actions = el("div", { "class": "form-status__actions" });
      var again = el("a", { "class": "btn btn--dark btn--sm", href: href }, "Apri di nuovo l'email");
      var copy = el("button", { "class": "btn btn--outline btn--sm", type: "button" }, "Copia il testo");
      copy.addEventListener("click", function () {
        var done = function () { copy.textContent = "Testo copiato"; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { copy.textContent = "Copia non riuscita: seleziona il testo qui sotto"; });
        } else { copy.textContent = "Seleziona il testo qui sotto e copialo"; }
      });
      actions.appendChild(again);
      actions.appendChild(copy);
      box.appendChild(actions);
      box.appendChild(el("p", { "class": "form-hint", style: "margin-top:16px" }, "Se non si apre nessun programma di posta, copia il testo e scrivi a " + recipient + " oppure chiama +39 338 809 9145."));
      box.appendChild(el("pre", { "class": "mail-preview", tabindex: "0", "aria-label": "Anteprima del messaggio" }, text));
    });
    window.location.href = href;
  }

  function endpointFlow(d) {
    var fd = new FormData(form);
    fd.set("_subject", "Richiesta preventivo — " + d.tipologia + " — " + d.comune);
    submitBtn.disabled = true;
    var label = submitBtn.textContent;
    submitBtn.textContent = "Invio in corso…";
    fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("is-valid", "is-invalid"); });
        touched = {};
        showStatus("ok", "Richiesta inviata", ["Abbiamo ricevuto la tua richiesta e ti risponderemo all'indirizzo email indicato."]);
      })
      .catch(function () {
        showStatus("error", "Invio non riuscito", [
          "La richiesta non è stata inviata. Riprova tra qualche istante oppure usa l'email o il telefono."
        ], function (box) {
          var actions = el("div", { "class": "form-status__actions" });
          actions.appendChild(el("a", { "class": "btn btn--dark btn--sm", href: mailtoHref(d) }, "Scrivi con la tua email"));
          box.appendChild(actions);
        });
      })
      .then(function () { submitBtn.disabled = false; submitBtn.textContent = label; });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;
    /* Honeypot anti-spam: se compilato, non fare nulla */
    if (form.elements._gotcha && form.elements._gotcha.value) return;
    var firstBad = null;
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      if (!rules[f.name]) return;
      touched[f.name] = true;
      if (!check(f) && !firstBad) firstBad = f;
    });
    if (firstBad) {
      showStatus("error", "Controlla i campi evidenziati", ["Alcune informazioni mancano o non sono corrette. Correggile e riprova."]);
      firstBad.focus();
      return;
    }
    var d = collect();
    if (endpoint) endpointFlow(d); else mailtoFlow(d);
  });
})();
