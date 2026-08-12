/* ==========================================================================
   CALLAN COACH — APLICAÇÃO PRINCIPAL
   ========================================================================== */

const app = document.getElementById("app");
let SETTINGS = null;
let SESSION = null; // sessão de treino ativa (Callan Mode)

async function boot() {
  Voice.init();
  await loadCustomQuestions();
  SETTINGS = await getSettings();
  if (!SETTINGS.onboarded) {
    renderOnboarding();
  } else {
    window.addEventListener("hashchange", route);
    route();
  }
  registerSW();
}

function route() {
  const hash = location.hash || "#/dashboard";
  const [, view, a, b, c] = hash.split("/");
  if (SESSION) { Voice.stopSpeaking(); SESSION = null; }
  switch (view) {
    case "dashboard": return renderDashboard();
    case "stage": return renderStage(Number(a));
    case "callan": return renderCallanSession({ stage: Number(a), lesson: b !== "undefined" ? Number(b) : null, mode: c || "lesson" });
    case "quicktrain": return renderCallanSession({ mode: "quick", minutes: Number(a) });
    case "errors": return renderErrorBank();
    case "progress": return renderProgress();
    case "vocab": return renderVocab();
    case "settings": return renderSettings();
    case "import": return renderImport();
    case "ai": return renderAISettings();
    case "conversation": return renderConversation();
    default: return renderDashboard();
  }
}

function nav(hash) { location.hash = hash; }

/* ============================== SHELL / NAV ============================== */
function shell(contentHtml, activeTab = "") {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand" onclick="nav('#/dashboard')">🎓 <span>Callan Coach</span></div>
      <button class="icon-btn" title="Configurações" onclick="nav('#/settings')">⚙️</button>
    </header>
    <main class="content">${contentHtml}</main>
    <nav class="tabbar">
      ${tabBtn("dashboard", "🏠", "Início")}
      ${tabBtn("stage/3", "🎙️", "Treinar")}
      ${tabBtn("errors", "🔄", "Erros")}
      ${tabBtn("progress", "📈", "Progresso")}
      ${tabBtn("vocab", "📖", "Vocabulário")}
    </nav>
  `;
}
function tabBtn(hash, icon, label) {
  return `<button class="tab" onclick="nav('#/${hash}')"><span>${icon}</span><small>${label}</small></button>`;
}

/* ============================== DASHBOARD ============================== */
async function renderDashboard() {
  const stats = await computeTodayStats();
  const stageProgress = await computeStageProgress(SETTINGS.currentStage);
  const dueCount = await countDue();
  const greetingName = SETTINGS.name ? `, ${escapeHtml(SETTINGS.name)}` : "";

  shell(`
    <div class="hero">
      <h1>Callan Coach</h1>
      <p class="muted">Good to see you again${greetingName}!</p>
      <div class="stagepill">Stage atual: <b>${SETTINGS.currentStage}</b></div>
      <div class="progressbar"><div class="fill" style="width:${stageProgress}%"></div></div>
      <small class="muted">${stageProgress}% do conteúdo carregado nesta stage já dominado</small>
    </div>

    <div class="cards grid2">
      <div class="card action" onclick="nav('#/callan/${SETTINGS.currentStage}/undefined/mixed')">🎙️ <b>TREINAR AGORA</b><small>Stage ${SETTINGS.currentStage} — misto</small></div>
      <div class="card action" onclick="nav('#/stage/1')">📚 <b>REVISAR STAGE 1</b></div>
      <div class="card action" onclick="nav('#/stage/2')">📚 <b>REVISAR STAGE 2</b></div>
      <div class="card action" onclick="nav('#/stage/3')">📖 <b>CONTINUAR STAGE 3</b></div>
      <div class="card action" onclick="nav('#/errors')">🔄 <b>REVISAR MEUS ERROS</b>${dueCount ? `<span class="badge">${dueCount}</span>` : ""}</div>
      <div class="card action" onclick="nav('#/conversation')">💬 <b>CONVERSAÇÃO</b></div>
    </div>

    <div class="statgrid">
      <div class="stat"><b>${stats.answered}</b><small>Perguntas hoje</small></div>
      <div class="stat"><b>${stats.minutes}m</b><small>Tempo de speaking</small></div>
      <div class="stat"><b>${stats.correct}</b><small>Acertos</small></div>
      <div class="stat"><b>${stats.wrong}</b><small>Erros</small></div>
      <div class="stat"><b>${SETTINGS.streak}🔥</b><small>Sequência</small></div>
      <div class="stat"><b>${SETTINGS.xp}⭐</b><small>XP</small></div>
    </div>

    <div class="section-title">Treino rápido</div>
    <div class="chiprow">
      ${[5, 10, 15, 20, 30].map((m) => `<button class="chip" onclick="nav('#/quicktrain/${m}')">${m} min</button>`).join("")}
    </div>
  `);
}

async function computeTodayStats() {
  const sessions = await Store.getAll("sessions");
  const today = new Date().toDateString();
  const todays = sessions.filter((s) => new Date(s.date).toDateString() === today);
  return {
    answered: todays.reduce((a, s) => a + s.answered, 0),
    correct: todays.reduce((a, s) => a + s.correct, 0),
    wrong: todays.reduce((a, s) => a + s.wrong, 0),
    minutes: Math.round(todays.reduce((a, s) => a + s.durationSec, 0) / 60),
  };
}
async function computeStageProgress(stage) {
  const questions = questionsForStage(stage);
  if (!questions.length) return 0;
  const progresses = await Promise.all(questions.map((q) => getProgress(q.id)));
  const avg = progresses.reduce((a, p) => a + p.mastery, 0) / progresses.length;
  return Math.round(avg);
}
async function countDue() {
  const all = allAvailableQuestions();
  const progresses = await Promise.all(all.map((q) => getProgress(q.id)));
  return progresses.filter((p) => p.nextReview && p.nextReview <= Date.now()).length;
}

/* ============================== STAGE / LESSONS ============================== */
function renderStage(stage) {
  const data = REAL_COURSE_DATA[stage];
  const known = KNOWN_LESSON_NUMBERS[stage] || [];
  const lessonRows = known.map((num) => {
    const lesson = data.lessons[num];
    const title = lesson.needsVerification
      ? `${lesson.topic} <span class="tag warn">nº a confirmar</span>`
      : lesson.topic;
    return `
      <div class="lessonrow">
        <div>
          <b>Lição ${num === 0 ? "(amostra)" : num}</b>
          <div class="muted small">${title}</div>
        </div>
        <div class="row-actions">
          <button class="btn small" onclick="nav('#/callan/${stage}/${num}/lesson')">Treinar</button>
        </div>
      </div>`;
  }).join("");

  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>${data.title}</h2>
    <p class="muted">Lições confirmadas nos seus materiais: ${known.length}. As demais podem ser adicionadas em <a href="#/import">Importar Conteúdo</a>.</p>
    <div class="lessonlist">${lessonRows}</div>
    <button class="btn secondary block" onclick="nav('#/callan/${stage}/undefined/mixed')">🔀 MISTURAR LIÇÕES DESTA STAGE</button>
  `);
}

/* ============================== CALLAN MODE (núcleo) ============================== */
async function renderCallanSession({ stage, lesson, mode, minutes }) {
  let queue = [];
  let title = "Callan Mode";
  if (mode === "quick") {
    queue = await buildQuickTrainQueue(minutes);
    title = `Treino rápido — ${minutes} min`;
  } else if (mode === "mixed") {
    queue = await buildQueue({ stage, size: 20, mode: "mixed" });
    title = `Stage ${stage} — misto`;
  } else if (mode === "errors") {
    queue = await buildErrorReviewQueue();
    title = "Revisão de erros";
  } else {
    queue = await buildQueue({ stage, lesson, size: lesson === 0 ? 30 : 12, mode: "lesson" });
    title = `Stage ${stage}${lesson !== null ? " · Lição " + lesson : ""}`;
  }

  if (!queue.length) {
    shell(`
      <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
      <div class="empty">
        <h3>Nada para treinar aqui ainda</h3>
        <p class="muted">Esta seleção não tem perguntas carregadas. Importe mais conteúdo em Configurações → Importar Conteúdo, ou escolha outra lição.</p>
      </div>
    `);
    return;
  }

  SESSION = {
    queue, index: 0, correct: 0, wrong: 0, answered: 0,
    startedAt: Date.now(), title, awaitingRepeat: false, retryQueue: [],
    topMistakes: [], responseTimes: [], questionShownAt: null,
  };
  renderSessionScreen();
}

function renderSessionScreen() {
  const s = SESSION;
  if (!s) return;
  const question = s.queue[s.index];
  if (!question) return finishSession();

  const pct = Math.round((s.index / s.queue.length) * 100);
  app.innerHTML = `
    <header class="topbar session">
      <button class="icon-btn" onclick="endSessionEarly()">✕</button>
      <div class="sesstitle">${escapeHtml(SESSION.title)}</div>
      <button class="icon-btn" onclick="pauseSession()">⏸</button>
    </header>
    <div class="progressbar thin"><div class="fill" style="width:${pct}%"></div></div>
    <main class="content session-content">
      <div class="qcounter">Question ${s.index + 1} / ${s.queue.length}</div>
      <div class="questioncard">
        <div class="qlabel">${questionTypeLabel(question)}</div>
        <div class="qtext" id="qtext">${escapeHtml(question.question)}</div>
        <div class="qcontrols">
          <button class="icon-btn" onclick="speakCurrent()">🔊</button>
        </div>
      </div>

      <div id="feedback" class="feedback hidden"></div>

      <div id="answerArea" class="answer-area">
        <div class="voice-row">
          <button id="micBtn" class="mic-btn" onclick="startListening()">🎙️ FALAR</button>
          <span id="listeningIndicator" class="muted hidden">🎙️ Listening…</span>
        </div>
        <div class="type-row">
          <input id="typedAnswer" type="text" placeholder="Ou digite sua resposta…" autocomplete="off"
                 onkeydown="if(event.key==='Enter') submitTyped()" />
          <button class="btn" onclick="submitTyped()">Enviar</button>
        </div>
        ${!Voice.recogSupported ? `<small class="muted">Seu navegador não suporta reconhecimento de voz. Use o modo de digitação ou o Chrome.</small>` : ""}
      </div>
    </main>
    <div class="sessionbar">
      <button class="chip" onclick="repeatQuestion()">🔁 REPETIR</button>
      <button class="chip" onclick="skipQuestion()">⏭ PULAR</button>
      <button class="chip" onclick="endSessionEarly()">🛑 FINALIZAR</button>
    </div>
  `;
  s.questionShownAt = Date.now();
  if (SETTINGS.voiceEnabled) speakCurrent();
}

function questionTypeLabel(question) {
  return question.question.trim().endsWith("?") ? "CALLAN QUESTION" : "COMPLETE / RESPOND";
}

function speakCurrent() {
  const q = SESSION?.queue[SESSION.index];
  if (!q) return;
  Voice.speak(q.question, { speed: SETTINGS.speed, voiceURI: SETTINGS.voiceURI });
}

async function startListening() {
  if (!Voice.recogSupported) return;
  const micBtn = document.getElementById("micBtn");
  const indicator = document.getElementById("listeningIndicator");
  micBtn.disabled = true;
  indicator.classList.remove("hidden");
  const text = await Voice.listenOnce();
  indicator.classList.add("hidden");
  micBtn.disabled = false;
  if (text) {
    document.getElementById("typedAnswer").value = text;
    await handleAnswer(text);
  }
}

function submitTyped() {
  const val = document.getElementById("typedAnswer").value;
  handleAnswer(val);
}

async function handleAnswer(rawAnswer) {
  const s = SESSION;
  if (!s) return;
  const question = s.queue[s.index];
  const responseMs = Date.now() - (s.questionShownAt || Date.now());
  s.responseTimes.push(responseMs);

  const result = classifyAnswer(question.answer, rawAnswer);
  const isCorrect = result.level === "correct";
  s.answered += 1;
  if (isCorrect) s.correct += 1; else { s.wrong += 1; s.topMistakes.push(question.question); }

  await recordAnswer(question.id, isCorrect);
  await clearErrorIfMastered(question.id);
  showFeedback(result, question, rawAnswer);
}

function showFeedback(result, question, rawAnswer) {
  const box = document.getElementById("feedback");
  box.classList.remove("hidden");
  let html = "";
  if (result.level === "correct") {
    html = `<div class="fb good">✅ Good!</div>`;
    Voice.speak("Good!");
    setTimeout(() => nextQuestion(), 700);
  } else if (result.level === "empty") {
    html = `<div class="fb warn">Say or type an answer to continue.</div>`;
    box.classList.add("hidden");
    return;
  } else {
    const hint = correctionHint(question.answer, rawAnswer);
    const errClass = result.level === "minor" ? "minor" : "major";
    html = `
      <div class="fb ${errClass}">
        <div>❌ ${hint || "Not quite."}</div>
        <div class="correct-answer">${escapeHtml(question.answer)}</div>
        <button class="btn small" onclick="repeatAfterCorrection()">Repeat</button>
        <button class="btn small secondary" onclick="nextQuestion()">Next question →</button>
      </div>`;
    Voice.speak("Not quite. " + question.answer);
  }
  box.innerHTML = html;
}

function repeatAfterCorrection() {
  const q = SESSION.queue[SESSION.index];
  Voice.speak(q.answer);
  document.getElementById("typedAnswer").value = "";
  document.getElementById("typedAnswer").focus();
}

function repeatQuestion() { speakCurrent(); }

function skipQuestion() { nextQuestion(); }

function nextQuestion() {
  const s = SESSION;
  if (!s) return;
  s.index += 1;
  renderSessionScreen();
}

function pauseSession() {
  Voice.stopSpeaking();
  const resume = confirm("Sessão pausada. Clique OK para continuar (Ready?).");
  if (resume) renderSessionScreen();
}

async function endSessionEarly() { await finishSession(); }

async function finishSession() {
  const s = SESSION;
  if (!s) { nav("#/dashboard"); return; }
  const durationSec = Math.round((Date.now() - s.startedAt) / 1000);
  const accuracy = s.answered ? Math.round((s.correct / s.answered) * 100) : 0;
  const xpGain = s.correct * 5 + s.answered * 1;

  await saveSession({
    date: Date.now(), title: s.title, answered: s.answered, correct: s.correct,
    wrong: s.wrong, durationSec, accuracy, topMistakes: s.topMistakes.slice(0, 5),
  });

  const today = new Date().toDateString();
  const last = SETTINGS.lastStudyDate;
  let streak = SETTINGS.streak || 0;
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = last === yesterday ? streak + 1 : 1;
  }
  SETTINGS.streak = streak;
  SETTINGS.lastStudyDate = today;
  SETTINGS.xp = (SETTINGS.xp || 0) + xpGain;
  await setSettings({ streak, lastStudyDate: today, xp: SETTINGS.xp });

  const mm = String(Math.floor(durationSec / 60)).padStart(2, "0");
  const ss = String(durationSec % 60).padStart(2, "0");

  SESSION = null;
  app.innerHTML = `
    <div class="content summary">
      <h2>SESSION COMPLETE</h2>
      <div class="summarygrid">
        <div><b>${mm}:${ss}</b><small>Time</small></div>
        <div><b>${s.answered}</b><small>Questions</small></div>
        <div><b>${s.correct}</b><small>Correct</small></div>
        <div><b>${s.wrong}</b><small>Incorrect</small></div>
        <div><b>${accuracy}%</b><small>Accuracy</small></div>
        <div><b>+${xpGain}⭐</b><small>XP</small></div>
      </div>
      ${s.topMistakes.length ? `
        <div class="section-title">Top mistakes</div>
        <ul class="mistakelist">${s.topMistakes.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
      ` : ""}
      <button class="btn block" onclick="nav('#/dashboard')">Voltar ao início</button>
      <button class="btn block secondary" onclick="nav('#/errors')">Revisar meus erros</button>
    </div>
  `;
}

/* ============================== ERROR BANK ============================== */
async function renderErrorBank() {
  const errors = (await Store.getAll("errors")).filter((e) => e.needsReview)
    .sort((a, b) => b.occurrences - a.occurrences);
  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>MEUS ERROS</h2>
    ${errors.length ? `<button class="btn block" onclick="nav('#/callan/0/undefined/errors')">🎙️ TREINAR TODOS OS ERROS</button>` : ""}
    <div class="errorlist">
      ${errors.length ? errors.map((e) => `
        <div class="errorcard">
          <div class="muted small">ERROR — ${e.occurrences}x · última vez: ${timeAgo(e.lastSeen)}</div>
          <div class="qtext small">${escapeHtml(e.question)}</div>
          <div class="correct-answer small">${escapeHtml(e.answer)}</div>
        </div>`).join("") : `<div class="empty"><p class="muted">Nenhum erro pendente — bom trabalho!</p></div>`}
    </div>
  `);
}

/* ============================== PROGRESSO ============================== */
async function renderProgress() {
  const sessions = (await Store.getAll("sessions")).sort((a, b) => b.date - a.date);
  const last7 = sessions.filter((s) => Date.now() - s.date < 7 * 86400000);
  const totalQ = last7.reduce((a, s) => a + s.answered, 0);
  const totalC = last7.reduce((a, s) => a + s.correct, 0);
  const acc7 = totalQ ? Math.round((totalC / totalQ) * 100) : 0;

  const stageBars = await Promise.all([1, 2, 3].map(async (st) => ({ st, pct: await computeStageProgress(st) })));

  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>PROGRESSO</h2>
    <div class="statgrid">
      <div class="stat"><b>${totalQ}</b><small>Perguntas (7d)</small></div>
      <div class="stat"><b>${acc7}%</b><small>Acurácia (7d)</small></div>
      <div class="stat"><b>${sessions.length}</b><small>Sessões totais</small></div>
    </div>
    <div class="section-title">Progresso por Stage</div>
    ${stageBars.map((b) => `
      <div class="stagebar-row">
        <span>Stage ${b.st}</span>
        <div class="progressbar"><div class="fill" style="width:${b.pct}%"></div></div>
        <span>${b.pct}%</span>
      </div>`).join("")}
    <div class="section-title">Histórico</div>
    <div class="historylist">
      ${sessions.slice(0, 20).map((s) => `
        <div class="historyrow">
          <div>${new Date(s.date).toLocaleDateString("pt-BR")} · ${escapeHtml(s.title)}</div>
          <div class="muted small">${s.answered} perguntas · ${s.correct} corretas · ${s.accuracy}%</div>
        </div>`).join("") || `<p class="muted">Ainda sem histórico.</p>`}
    </div>
  `);
}

/* ============================== VOCABULÁRIO ============================== */
async function renderVocab() {
  const map = new Map();
  for (const stage of Object.values(REAL_COURSE_DATA)) {
    for (const lesson of Object.values(stage.lessons)) {
      for (const w of lesson.vocabulary || []) {
        const key = `${lesson.stage}-${w}`;
        if (!map.has(key)) map.set(key, { word: w, stage: lesson.stage, lesson: lesson.lesson });
      }
    }
  }
  const words = [...map.values()];
  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>MY VOCABULARY</h2>
    <p class="muted">${words.length} palavras carregadas dos seus materiais.</p>
    <div class="vocablist">
      ${words.map((w) => `
        <div class="vocabrow">
          <b>${escapeHtml(w.word)}</b>
          <span class="tag">Stage ${w.stage} · Lição ${w.lesson}</span>
        </div>`).join("")}
    </div>
  `);
}

/* ============================== CONVERSAÇÃO (livre, opcional) ============================== */
function renderConversation() {
  const categories = ["Work","Travel","Restaurant","Shopping","Gym","Family","Daily Routine","Weekend","Holidays","Money","Cars","Food","Home","Plans","Feelings"];
  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>CONVERSAÇÃO</h2>
    <p class="muted">Este modo é livre e não depende de IA — perguntas abertas por categoria, você responde por voz ou texto e o app registra tempo de fala. Correção estrutural (Callan) fica nos outros modos.</p>
    <div class="chiprow">${categories.map((c) => `<button class="chip">${c}</button>`).join("")}</div>
    <p class="muted small">Dica: quando você conectar uma IA local (Ollama) em Configurações → IA Local, este modo pode virar um bate-papo real. Sem IA, use-o para praticar respostas em voz alta cronometradas.</p>
  `);
}

/* ============================== CONFIGURAÇÕES ============================== */
function renderSettings() {
  shell(`
    <button class="back" onclick="nav('#/dashboard')">← Voltar</button>
    <h2>CONFIGURAÇÕES</h2>
    <div class="formcard">
      <label>Nome<input id="setName" value="${escapeHtml(SETTINGS.name)}" /></label>
      <label>Stage atual
        <select id="setStage">
          ${[1,2,3].map((n) => `<option value="${n}" ${SETTINGS.currentStage===n?"selected":""}>Stage ${n}</option>`).join("")}
        </select>
      </label>
      <label>Velocidade
        <select id="setSpeed">
          ${["slow","normal","fast","callan"].map((v) => `<option value="${v}" ${SETTINGS.speed===v?"selected":""}>${v}</option>`).join("")}
        </select>
      </label>
      <label>Voz (TTS)
        <select id="setVoice">
          <option value="">Padrão do navegador</option>
          ${Voice.voices.map((v) => `<option value="${v.voiceURI}" ${SETTINGS.voiceURI===v.voiceURI?"selected":""}>${v.name} (${v.lang})</option>`).join("")}
        </select>
      </label>
      <label class="switch-row"><input type="checkbox" id="setVoiceEnabled" ${SETTINGS.voiceEnabled?"checked":""}/> Falar perguntas automaticamente</label>
      <label class="switch-row"><input type="checkbox" id="setAllowRepeat" ${SETTINGS.allowRepeat?"checked":""}/> Permitir repetição</label>
      <button class="btn block" onclick="saveSettingsForm()">Salvar</button>
    </div>

    <div class="section-title">Dados locais</div>
    <div class="formcard">
      <button class="btn block secondary" onclick="exportBackup()">⬇️ EXPORT DATA / DOWNLOAD BACKUP</button>
      <label class="btn block secondary filelabel">⬆️ IMPORT DATA / RESTORE BACKUP
        <input type="file" accept="application/json" id="restoreFile" onchange="restoreBackup(event)" hidden />
      </label>
      <button class="btn block danger" onclick="resetProgress()">🗑 RESETAR PROGRESSO</button>
    </div>

    <div class="section-title">Conteúdo</div>
    <div class="formcard">
      <button class="btn block secondary" onclick="nav('#/import')">📥 IMPORTAR CONTEÚDO (JSON)</button>
      <button class="btn block secondary" onclick="nav('#/ai')">🤖 AI SETTINGS (Ollama — opcional)</button>
    </div>
    <p class="muted small" style="text-align:center;margin-top:16px">Callan Coach funciona 100% local. Nenhum dado é enviado para servidores, nenhuma IA paga é usada.</p>
  `);
}

async function saveSettingsForm() {
  const name = document.getElementById("setName").value.trim();
  const currentStage = Number(document.getElementById("setStage").value);
  const speed = document.getElementById("setSpeed").value;
  const voiceURI = document.getElementById("setVoice").value || null;
  const voiceEnabled = document.getElementById("setVoiceEnabled").checked;
  const allowRepeat = document.getElementById("setAllowRepeat").checked;
  await setSettings({ name, currentStage, speed, voiceURI, voiceEnabled, allowRepeat });
  SETTINGS = await getSettings();
  nav("#/dashboard");
}

async function exportBackup() {
  const data = await exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `callan-coach-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
}

async function restoreBackup(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    await importAllData(data);
    alert("Backup restaurado com sucesso.");
    SETTINGS = await getSettings();
    nav("#/dashboard");
  } catch (e) {
    alert("Não foi possível ler este arquivo de backup.");
  }
}

async function resetProgress() {
  if (!confirm("Isso vai apagar todo o seu progresso, erros e histórico. Tem certeza?")) return;
  await resetAllProgress();
  alert("Progresso resetado.");
  nav("#/dashboard");
}

/* ============================== IMPORTAR CONTEÚDO ============================== */
function renderImport() {
  shell(`
    <button class="back" onclick="nav('#/settings')">← Voltar</button>
    <h2>IMPORTAR CONTEÚDO</h2>
    <p class="muted">Cole ou envie um JSON no formato abaixo para adicionar lições reais (ex.: o restante do Stage 1 e do Stage 3, depois de você extrair o texto do seu livro). Isso nunca sobrescreve o conteúdo já carregado.</p>
    <pre class="codeblock">{
  "id": "s1-l3",
  "stage": 1,
  "lesson": 3,
  "topic": "…",
  "vocabulary": ["…"],
  "questions": [
    { "id": "s1-l3-q1", "stage": 1, "lesson": 3, "question": "…", "answer": "…" }
  ]
}</pre>
    <textarea id="importJson" rows="10" placeholder="Cole o JSON aqui…"></textarea>
    <button class="btn block" onclick="importContentFromTextarea()">Importar</button>
    <label class="btn block secondary filelabel">Ou enviar arquivo .json
      <input type="file" accept="application/json" onchange="importContentFromFile(event)" hidden />
    </label>
  `);
}

async function importContentFromTextarea() {
  const text = document.getElementById("importJson").value;
  try {
    const lesson = JSON.parse(text);
    await Store.put("customLessons", lesson);
    await loadCustomQuestions();
    alert(`Lição importada: Stage ${lesson.stage}, Lição ${lesson.lesson}`);
    nav("#/dashboard");
  } catch (e) {
    alert("JSON inválido. Verifique o formato e tente novamente.");
  }
}
async function importContentFromFile(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const text = await file.text();
  document.getElementById("importJson").value = text;
  importContentFromTextarea();
}

/* ============================== AI SETTINGS (opcional, Ollama) ============================== */
function renderAISettings() {
  shell(`
    <button class="back" onclick="nav('#/settings')">← Voltar</button>
    <h2>AI SETTINGS</h2>
    <p class="muted">Totalmente opcional. Se você instalar o <a href="https://ollama.com" target="_blank">Ollama</a> localmente, pode conectar aqui para habilitar conversação livre com IA. Sem isso, o Callan Coach continua funcionando normalmente — o modo estruturado NUNCA depende de IA.</p>
    <div class="formcard">
      <div>Status: <span id="aiStatus" class="tag warn">Not connected</span></div>
      <label>Provider<input value="Ollama" disabled /></label>
      <label>Endpoint<input id="aiEndpoint" value="http://localhost:11434" /></label>
      <button class="btn block secondary" onclick="testOllamaConnection()">TEST CONNECTION</button>
    </div>
  `);
}
async function testOllamaConnection() {
  const endpoint = document.getElementById("aiEndpoint").value;
  const statusEl = document.getElementById("aiStatus");
  statusEl.textContent = "Testing…";
  try {
    const res = await fetch(endpoint + "/api/tags", { method: "GET" });
    if (res.ok) { statusEl.textContent = "Connected ✅"; statusEl.className = "tag good"; }
    else throw new Error();
  } catch (e) {
    statusEl.textContent = "Not connected"; statusEl.className = "tag warn";
  }
}

/* ============================== ONBOARDING ============================== */
function renderOnboarding() {
  app.innerHTML = `
    <div class="onboarding">
      <h1>WELCOME TO CALLAN COACH</h1>
      <p>Let's improve your English.</p>
      <label>What's your name?<input id="obName" placeholder="Letícia" /></label>
      <label>What is your current level?
        <select id="obStage">
          <option value="1">Stage 1</option>
          <option value="2">Stage 2</option>
          <option value="3" selected>Stage 3</option>
        </select>
      </label>
      <button class="btn block" onclick="finishOnboarding()">Começar</button>
    </div>
  `;
}
async function finishOnboarding() {
  const name = document.getElementById("obName").value.trim();
  const currentStage = Number(document.getElementById("obStage").value);
  await setSettings({ name, currentStage, onboarded: true });
  SETTINGS = await getSettings();
  window.addEventListener("hashchange", route);
  nav("#/dashboard");
  route();
}

/* ============================== UTIL ============================== */
function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function timeAgo(ts) {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  return `${days} dias atrás`;
}
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();
