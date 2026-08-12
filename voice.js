/* ==========================================================================
   CALLAN COACH — VOZ (Web Speech API)
   Funciona 100% no navegador, sem servidor. Se o navegador não suportar,
   a aplicação cai automaticamente para o modo de digitação — nunca quebra.
   ========================================================================== */

const Voice = {
  synthSupported: "speechSynthesis" in window,
  recogSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  voices: [],
  recognition: null,
  listening: false,

  init() {
    if (this.synthSupported) {
      const load = () => { this.voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en")); };
      load();
      speechSynthesis.onvoiceschanged = load;
    }
    if (this.recogSupported) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SR();
      this.recognition.lang = "en-US";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  },

  speedRate(speed) {
    return { slow: 0.7, normal: 1, fast: 1.25, callan: 1.45 }[speed] || 1;
  },

  speak(text, { speed = "normal", voiceURI = null } = {}) {
    if (!this.synthSupported || !text) return Promise.resolve();
    return new Promise((resolve) => {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-GB";
      utter.rate = this.speedRate(speed);
      const chosen = voiceURI ? this.voices.find((v) => v.voiceURI === voiceURI) : null;
      if (chosen) utter.voice = chosen;
      else {
        const enGB = this.voices.find((v) => v.lang === "en-GB");
        if (enGB) utter.voice = enGB;
      }
      utter.onend = resolve;
      utter.onerror = resolve;
      speechSynthesis.speak(utter);
    });
  },

  stopSpeaking() {
    if (this.synthSupported) speechSynthesis.cancel();
  },

  // Escuta uma vez e resolve com a transcrição (ou null em erro/sem suporte).
  listenOnce({ onStart, onEnd } = {}) {
    if (!this.recogSupported) return Promise.resolve(null);
    return new Promise((resolve) => {
      const rec = this.recognition;
      let done = false;
      rec.onstart = () => { this.listening = true; onStart && onStart(); };
      rec.onresult = (e) => {
        done = true;
        const text = e.results?.[0]?.[0]?.transcript || "";
        resolve(text);
      };
      rec.onerror = () => { if (!done) { done = true; resolve(null); } };
      rec.onend = () => { this.listening = false; onEnd && onEnd(); if (!done) resolve(null); };
      try { rec.start(); } catch (err) { resolve(null); }
    });
  },

  abortListening() {
    if (this.recognition && this.listening) {
      try { this.recognition.abort(); } catch (e) {}
    }
  },
};
