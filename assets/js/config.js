/*
 * Configurazione del modulo di richiesta preventivo.
 *
 * Il sito è statico (GitHub Pages) e non ha un server che riceva i dati.
 * Modalità predefinita ("mailto"): il modulo prepara un'email già compilata e la
 * apre nel programma di posta dell'utente, che deve premere Invia.
 *
 * Per un invio diretto senza programma di posta, inserire in formEndpoint l'URL
 * di un servizio di raccolta moduli (es. Formspree, Getform, Web3Forms) o di un
 * backend proprio che accetti una POST multipart/form-data e risponda 2xx.
 * Il messaggio di conferma viene mostrato solo se il servizio risponde con
 * successo. Non inserire in questo file chiavi segrete: gli endpoint pubblici
 * dei servizi di form sono pensati per essere visibili nel codice della pagina.
 */
window.LEONARDO_CONFIG = {
  recipientEmail: "info@impresaedileleonardo.com",
  formEndpoint: ""
};
