/* ==========================================================================
   CALLAN COACH — MOTOR DE PERGUNTAS E CORREÇÃO
   ========================================================================== */

function findQuestionById(id) {
  return ALL_QUESTIONS.find((q) => q.id === id) || CUSTOM_QUESTIONS_CACHE.find((q) => q.id === id);
}

let CUSTOM_QUESTIONS_CACHE = [];
async function loadCustomQuestions() {
  const lessons = await Store.getAll("customLessons");
  CUSTOM_QUESTIONS_CACHE = [];
  for (const lesson of lessons) {
    for (const question of lesson.questions || []) CUSTOM_QUESTIONS_CACHE.push(question);
  }
  return CUSTOM_QUESTIONS_CACHE;
}

function questionsForLesson(stage, lesson) {
  const built = REAL_COURSE_DATA[stage]?.lessons?.[lesson]?.questions || [];
  const custom = CUSTOM_QUESTIONS_CACHE.filter((q) => q.stage === stage && q.lesson === lesson);
  return [...built, ...custom];
}

function questionsForStage(stage) {
  const lessons = REAL_COURSE_DATA[stage]?.lessons || {};
  let out = [];
  for (const l of Object.values(lessons)) out = out.concat(l.questions);
  out = out.concat(CUSTOM_QUESTIONS_CACHE.filter((q) => q.stage === stage));
  return out;
}

function allAvailableQuestions() {
  return [...ALL_QUESTIONS, ...CUSTOM_QUESTIONS_CACHE];
}

/* ---------------- Seleção com estratégia (não 100% aleatório) ---------------- */
// Prioriza: 1) erros recorrentes vencidos p/ revisão  2) conteúdo antigo esquecido
// 3) conteúdo atual  4) resto aleatório ponderado por baixa maestria.
async function buildQueue({ stage, lesson = null, size = 20, mode = "lesson" }) {
  const pool = lesson != null ? questionsForLesson(stage, lesson) : questionsForStage(stage);
  if (!pool.length) return [];
  const withProgress = await Promise.all(pool.map(async (question) => ({
    question, progress: await getProgress(question.id),
  })));

  const due = withProgress.filter((x) => x.progress.nextReview && x.progress.nextReview <= Date.now());
  const weak = withProgress.filter((x) => x.progress.mastery < 60 && !due.includes(x));
  const fresh = withProgress.filter((x) => x.progress.repetitions === 0 && !due.includes(x) && !weak.includes(x));
  const rest = withProgress.filter((x) => !due.includes(x) && !weak.includes(x) && !fresh.includes(x));

  const ordered = [...shuffle(due), ...shuffle(weak), ...shuffle(fresh), ...shuffle(rest)];
  return ordered.slice(0, size).map((x) => x.question);
}

async function buildQuickTrainQueue(minutes) {
  const approxCount = Math.max(6, Math.round(minutes * 2.2));
  const all = allAvailableQuestions();
  const withProgress = await Promise.all(all.map(async (question) => ({
    question, progress: await getProgress(question.id),
  })));
  const due = withProgress.filter((x) => x.progress.nextReview && x.progress.nextReview <= Date.now());
  const weak = withProgress.filter((x) => x.progress.mastery < 60 && !due.includes(x));
  const rest = withProgress.filter((x) => !due.includes(x) && !weak.includes(x));
  const ordered = [...shuffle(due), ...shuffle(weak), ...shuffle(rest)];
  return ordered.slice(0, approxCount).map((x) => x.question);
}

async function buildErrorReviewQueue() {
  const errors = (await Store.getAll("errors")).filter((e) => e.needsReview);
  const questions = errors.map((e) => findQuestionById(e.id)).filter(Boolean);
  return shuffle(questions);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- Correção ---------------- */
function normalize(text) {
  let t = (text || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos (não exigir acento)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');
  // contrações equivalentes (I'm == I am) — função vem de speech_correction.js,
  // carregado antes do app rodar; se ainda não existir (testes isolados), ignora.
  if (typeof expandContractions === "function") t = expandContractions(t);
  return t.replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
}

// Distância de edição por palavras (Levenshtein a nível de token) — robusta
// o bastante para pequenas variações sem exigir cópia exata.
function wordDiff(expected, actual) {
  const e = normalize(expected).split(" ").filter(Boolean);
  const a = normalize(actual).split(" ").filter(Boolean);
  const dp = Array.from({ length: e.length + 1 }, () => new Array(a.length + 1).fill(0));
  for (let i = 0; i <= e.length; i++) dp[i][0] = i;
  for (let j = 0; j <= a.length; j++) dp[0][j] = j;
  for (let i = 1; i <= e.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (e[i - 1] === a[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return { distance: dp[e.length][a.length], expectedLen: e.length };
}

// Classificação: correto | pequeno erro | erro importante | (recorrente é calculado fora, no progress)
function classifyAnswer(expected, actual) {
  if (!actual || !actual.trim()) return { level: "empty", distance: 999 };
  const { distance, expectedLen } = wordDiff(expected, actual);
  const ratio = distance / Math.max(1, expectedLen);
  if (ratio === 0) return { level: "correct", distance };
  if (ratio <= 0.2) return { level: "minor", distance };
  if (ratio <= 0.5) return { level: "major", distance };
  return { level: "wrong", distance };
}

// Gera uma dica curta de correção (não uma aula de gramática).
function correctionHint(expected, actual) {
  const e = normalize(expected).split(" ");
  const a = normalize(actual).split(" ");
  for (let i = 0; i < Math.max(e.length, a.length); i++) {
    if (e[i] !== a[i]) {
      if (a[i] && e[i]) return `Not "${a[i]}" — "${e[i]}".`;
      if (!a[i]) return `Missing: "${e[i]}".`;
      return `Extra word: "${a[i]}".`;
    }
  }
  return "";
}
