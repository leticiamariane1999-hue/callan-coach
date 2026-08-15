/* ==========================================================================
   CALLAN COACH — CAMADA DE DADOS LOCAL (IndexedDB)
   100% local. Nenhum dado sai do seu computador.
   ========================================================================== */

const DB_NAME = "callan-coach";
const DB_VERSION = 2; // v2: +stats (contador local), +errors.errorKind (English x Transcription)
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      // Migração aditiva: NUNCA apaga stores existentes, só cria o que falta.
      const db = e.target.result;
      if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "id" }); // per-question SRS state
      }
      if (!db.objectStoreNames.contains("errors")) {
        db.createObjectStore("errors", { keyPath: "id" }); // wrong-answer bank
      }
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("customLessons")) {
        db.createObjectStore("customLessons", { keyPath: "id" }); // imported JSON content
      }
      if (!db.objectStoreNames.contains("vocab")) {
        db.createObjectStore("vocab", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("stats")) {
        db.createObjectStore("stats", { keyPath: "key" }); // contador local (page views, visitas)
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(storeName, mode = "readonly") {
  return openDB().then((db) => db.transaction(storeName, mode).objectStore(storeName));
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const Store = {
  async get(storeName, key) {
    const store = await tx(storeName);
    return reqToPromise(store.get(key));
  },
  async getAll(storeName) {
    const store = await tx(storeName);
    return reqToPromise(store.getAll());
  },
  async put(storeName, value) {
    const store = await tx(storeName, "readwrite");
    return reqToPromise(store.put(value));
  },
  async delete(storeName, key) {
    const store = await tx(storeName, "readwrite");
    return reqToPromise(store.delete(key));
  },
  async clear(storeName) {
    const store = await tx(storeName, "readwrite");
    return reqToPromise(store.clear());
  },
};

/* ---------------- Spaced repetition (simples e confiável) ---------------- */
// Intervalos em minutos: erro -> 10min; depois 1 dia -> 3 dias -> 7 dias -> 14 dias -> 30 dias
const SRS_STEPS_MIN = [10, 24 * 60, 3 * 24 * 60, 7 * 24 * 60, 14 * 24 * 60, 30 * 24 * 60];

async function getProgress(questionId) {
  const p = await Store.get("progress", questionId);
  return p || {
    id: questionId, repetitions: 0, correctAnswers: 0, wrongAnswers: 0,
    errorCount: 0, step: 0, mastery: 0, lastReviewed: null, nextReview: 0,
  };
}

async function recordAnswer(questionId, correct) {
  const p = await getProgress(questionId);
  p.repetitions += 1;
  p.lastReviewed = Date.now();
  if (correct) {
    p.correctAnswers += 1;
    p.step = Math.min(p.step + 1, SRS_STEPS_MIN.length - 1);
    p.mastery = Math.min(100, Math.round((p.correctAnswers / p.repetitions) * 100));
  } else {
    p.wrongAnswers += 1;
    p.errorCount += 1;
    p.step = 0;
    p.mastery = Math.max(0, p.mastery - 15);
    await addError(questionId);
  }
  p.nextReview = Date.now() + SRS_STEPS_MIN[p.step] * 60 * 1000;
  await Store.put("progress", p);
  return p;
}

async function addError(questionId) {
  const question = findQuestionById(questionId);
  if (!question) return;
  const existing = await Store.get("errors", questionId);
  const entry = existing || {
    id: questionId, question: question.question, answer: question.answer,
    occurrences: 0, firstSeen: Date.now(),
  };
  entry.occurrences += 1;
  entry.lastSeen = Date.now();
  entry.needsReview = true;
  await Store.put("errors", entry);
}

async function clearErrorIfMastered(questionId) {
  const p = await getProgress(questionId);
  if (p.mastery >= 85) {
    const e = await Store.get("errors", questionId);
    if (e) { e.needsReview = false; await Store.put("errors", e); }
  }
}

/* ---------------- Sessão de estudo ---------------- */
async function saveSession(session) {
  return Store.put("sessions", session);
}

/* ---------------- Configurações ---------------- */
const DEFAULT_SETTINGS = {
  name: "Leticia Alves",
  currentStage: 3,
  speed: "normal",       // slow | normal | fast | callan | auto
  voiceURI: null,
  correctionMode: "immediate",
  voiceEnabled: true,
  allowRepeat: true,
  streak: 0,
  lastStudyDate: null,
  xp: 0,
  onboarded: false,
  translationMode: "button",   // hidden | button | auto
  recognitionLang: "en-US",    // en-US | en-GB
  imagesEnabled: true,
  adminPassword: null,
};

async function getSettings() {
  const rows = await Store.getAll("settings");
  const s = { ...DEFAULT_SETTINGS };
  for (const r of rows) s[r.key] = r.value;
  return s;
}
async function setSetting(key, value) {
  return Store.put("settings", { key, value });
}
async function setSettings(obj) {
  for (const [k, v] of Object.entries(obj)) await setSetting(k, v);
}

/* ---------------- Backup / Restore ---------------- */
async function exportAllData() {
  const [progress, errors, sessions, settingsRows, customLessons, vocab] = await Promise.all([
    Store.getAll("progress"), Store.getAll("errors"), Store.getAll("sessions"),
    Store.getAll("settings"), Store.getAll("customLessons"), Store.getAll("vocab"),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    app: "Callan Coach", version: 1,
    progress, errors, sessions, settings: settingsRows, customLessons, vocab,
  };
}

async function importAllData(data) {
  if (!data || typeof data !== "object") throw new Error("Backup inválido");
  const stores = { progress: data.progress, errors: data.errors, sessions: data.sessions,
    settings: data.settings, customLessons: data.customLessons, vocab: data.vocab };
  for (const [name, rows] of Object.entries(stores)) {
    if (!Array.isArray(rows)) continue;
    for (const row of rows) await Store.put(name, row);
  }
}

async function resetAllProgress() {
  await Promise.all(["progress", "errors", "sessions"].map((s) => Store.clear(s)));
}

/* ---------------- Estatísticas locais (VISUALIZAÇÕES) ----------------
   IMPORTANTE: isto conta acessos SÓ NESTE navegador/dispositivo — não é
   um contador público de visitantes do site. Ver nota em renderAdmin(). */
async function recordPageView() {
  const rows = await Store.getAll("stats");
  const map = {}; for (const r of rows) map[r.key] = r.value;
  const now = Date.now();
  const today = new Date().toDateString();

  map.totalViews = (map.totalViews || 0) + 1;
  map.lastVisit = now;
  map.viewsByDay = map.viewsByDay || {};
  map.viewsByDay[today] = (map.viewsByDay[today] || 0) + 1;

  if (!map.firstVisit) map.firstVisit = now;
  if (map.lastSessionMark !== today) {
    map.uniqueDays = (map.uniqueDays || 0) + 1;
    map.lastSessionMark = today;
  }

  for (const [key, value] of Object.entries(map)) await Store.put("stats", { key, value });
  return map;
}

async function getStats() {
  const rows = await Store.getAll("stats");
  const map = {}; for (const r of rows) map[r.key] = r.value;
  return map;
}
