# Impresa Edile Leonardo — proposta di sito (demo)

Proposta dimostrativa di restyling del sito di Impresa Edile Leonardo (Cavaria con Premezzo, VA),
realizzata da [Tramontis](https://tramontis.netlify.app/). **Non è il sito ufficiale** e non è ancora attiva.

Sito statico in HTML, CSS e JavaScript semplice: nessun framework, nessun build, nessuna dipendenza da CDN
(font e icone sono locali). Pronto per GitHub Pages.

## Pagine

| File | Contenuto |
| --- | --- |
| `index.html` | Home: hero, profilo, servizi, metodo, cantiere, progettazione, qualità, CTA |
| `servizi.html` | Undici servizi con descrizione, dettagli e richiesta informazioni |
| `progetti.html` | Galleria con filtri e lightbox: foto di cantiere + sezione separata di ispirazione |
| `impresa.html` | L'impresa, principi di lavoro e metodo in quattro passaggi |
| `contatti.html` | Recapiti e modulo di richiesta preventivo |
| `privacy.html` | Informativa sintetica provvisoria per la demo |
| `404.html` | Pagina di errore (GitHub Pages la usa automaticamente) |

Tutti i percorsi sono **relativi**: il sito funziona sia come project site
(`https://utente.github.io/repo/`) sia su un dominio dedicato.

## Pubblicazione su GitHub Pages

1. Repository → *Settings* → *Pages*.
2. *Source*: `Deploy from a branch`, branch scelto, cartella `/ (root)`.
3. Il file `.nojekyll` è già presente.

I meta Open Graph usano l'URL assoluto `https://luckylori07.github.io/impresaedileleonardo/…`
(solo per l'immagine di anteprima). Se l'indirizzo di pubblicazione è diverso, aggiornare `og:image`
in ogni `<head>`.

## Modulo di richiesta: come funziona davvero

Il sito è statico e **non ha un server** che riceva i dati. Per questo:

- **Modalità predefinita (mailto)**: dopo la validazione, il modulo apre il programma di posta dell'utente con
  un'email già compilata e indirizzata a `info@impresaedileleonardo.com`. L'utente deve premere *Invia*.
  La pagina mostra un messaggio "Richiesta pronta: manca solo l'invio" con pulsanti *Apri di nuovo l'email* e
  *Copia il testo*, e **non dichiara mai che la richiesta è stata inviata**, perché non può saperlo.
- **Invio diretto (opzionale)**: in `assets/js/config.js` impostare `formEndpoint` con l'URL di un servizio di
  raccolta moduli (Formspree, Getform, Web3Forms o un backend proprio che accetti `multipart/form-data`).
  In questo caso il modulo invia con `fetch` e mostra la conferma **solo se il servizio risponde con successo**;
  in caso di errore mostra un messaggio di fallimento e l'alternativa via email.
- Il destinatario dell'email si cambia in `recipientEmail`, sempre in `config.js`.
- Nel codice non ci sono chiavi o credenziali. Se si attiva un servizio esterno, aggiornare la privacy policy.

## Cosa togliere prima della messa online definitiva

La demo è volutamente marcata come tale. Per trasformarla nel sito definitivo:

- rimuovere il blocco `.demo-banner` da ogni pagina e la regola `body::after` (filigrana) in `assets/css/style.css`;
- rimuovere `<meta name="robots" content="noindex, nofollow">` da ogni pagina; aggiungere sitemap e canonical;
- sostituire `privacy.html` con la privacy policy completa dell'impresa (titolare, dati societari, diritti);
- verificare i dati societari in footer (oggi: *Studio Progetto Leonardo S.R.L.*, come riportato nell'informativa
  privacy del sito attuale);
- sostituire le immagini illustrative (`assets/img/illustrative/`) con fotografie dell'impresa;
- aggiornare `og:image`, `og:url` e il markup JSON-LD in `index.html` con l'indirizzo definitivo;
- decidere se inserire cookie banner solo se verranno aggiunti analytics o servizi di terze parti.

## Immagini e provenienza

Vedi [`assets/img/CREDITS.md`](assets/img/CREDITS.md).

## Struttura

```
index.html · servizi.html · progetti.html · impresa.html · contatti.html · privacy.html · 404.html
robots.txt · .nojekyll
assets/
  css/style.css
  js/main.js · progetti.js · contatti.js · config.js
  fonts/     Archivo e Public Sans (variabili, latin) — licenza SIL OFL
  img/       emblema, icone SVG, favicon, immagine OG
    cantiere/        fotografie di cantiere dell'impresa
    illustrative/    immagini illustrative Unsplash
```
