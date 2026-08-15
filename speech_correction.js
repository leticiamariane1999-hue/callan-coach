/* ==========================================================================
   CALLAN COACH — SPEECH CORRECTION ENGINE
   Não trata a transcrição do navegador como verdade absoluta. Aplica
   normalização de contrações, um dicionário de palavras foneticamente
   parecidas (erros típicos de reconhecimento de voz) e correção
   contextual usando o vocabulário da própria pergunta, antes de comparar
   com a resposta esperada.
   ========================================================================== */

// Pares de contrações equivalentes (comparação sempre ignora a diferença).
const CONTRACTIONS = [
  ["i am", "i'm"], ["you are", "you're"], ["he is", "he's"], ["she is", "she's"],
  ["it is", "it's"], ["we are", "we're"], ["they are", "they're"],
  ["is not", "isn't"], ["are not", "aren't"], ["was not", "wasn't"], ["were not", "weren't"],
  ["do not", "don't"], ["does not", "doesn't"], ["did not", "didn't"],
  ["have not", "haven't"], ["has not", "hasn't"], ["had not", "hadn't"],
  ["cannot", "can't"], ["will not", "won't"], ["would not", "wouldn't"],
  ["should not", "shouldn't"], ["that is", "that's"], ["there is", "there's"],
  ["what is", "what's"], ["who is", "who's"], ["let us", "let's"],
];

// Palavras foneticamente parecidas — erros típicos de reconhecimento de voz.
// Se a palavra transcrita não bate mas uma "confusável" bate, tratamos
// como TRANSCRIPTION ERROR (não conta como erro de inglês).
const CONFUSABLES = {
  than: ["then"], then: ["than"],
  there: ["their", "they're"], their: ["there", "they're"], "they're": ["there", "their"],
  to: ["too", "two"], too: ["to", "two"], two: ["to", "too"],
  where: ["wear"], wear: ["where"],
  are: ["our"], our: ["are"],
  i: ["eye"], eye: ["i"],
  see: ["sea"], sea: ["see"],
  be: ["bee"], bee: ["be"],
  write: ["right"], right: ["write"],
  know: ["no"], no: ["know"],
  hear: ["here"], here: ["hear"],
  won: ["one"], one: ["won"],
  for: ["four"], four: ["for"],
  son: ["sun"], sun: ["son"],
  break: ["brake"], brake: ["break"],
};

function expandContractions(text) {
  let t = " " + text.toLowerCase() + " ";
  for (const [full, contracted] of CONTRACTIONS) {
    t = t.split(` ${contracted} `).join(` ${full} `);
    t = t.split(` ${contracted},`).join(` ${full},`);
  }
  return t.trim();
}

function stripDiacritics(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Normalização "profunda": minúsculas, sem acento, contrações expandidas,
// pontuação fora, espaços únicos.
function deepNormalize(text) {
  let t = stripDiacritics(text || "");
  t = expandContractions(t);
  t = t.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
       .replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
  return t;
}

// Tenta "consertar" palavras da transcrição usando o dicionário de
// confusáveis, guiado pelas palavras esperadas na resposta (contexto).
// Retorna { corrected, changed: [{from, to}] }
function contextualCorrect(transcript, expectedAnswer) {
  const expectedWords = new Set(deepNormalize(expectedAnswer).split(" "));
  const words = deepNormalize(transcript).split(" ");
  const changed = [];
  const corrected = words.map((w) => {
    if (expectedWords.has(w)) return w; // já bate, não mexe
    const options = CONFUSABLES[w];
    if (options) {
      const fix = options.find((o) => expectedWords.has(o));
      if (fix) { changed.push({ from: w, to: fix }); return fix; }
    }
    return w;
  });
  return { corrected: corrected.join(" "), changed };
}

// Resultado completo: nível de erro + se foi correção de transcrição.
function evaluateAnswer(expectedAnswer, rawTranscript) {
  if (!rawTranscript || !rawTranscript.trim()) {
    return { level: "empty", transcriptionFix: null };
  }
  // 1) tenta direto (com deep-normalize, que já cobre contrações/acentos)
  let direct = classifyAnswer(expectedAnswer, rawTranscript);
  if (direct.level === "correct") {
    return { level: "correct", transcriptionFix: null, finalText: rawTranscript };
  }
  // 2) tenta com correção contextual (palavras confundíveis)
  const { corrected, changed } = contextualCorrect(rawTranscript, expectedAnswer);
  if (changed.length) {
    const fixedResult = classifyAnswer(expectedAnswer, corrected);
    if (fixedResult.level === "correct" || fixedResult.level === "minor") {
      return {
        level: fixedResult.level,
        transcriptionFix: { original: rawTranscript, corrected, changed },
        finalText: corrected,
      };
    }
  }
  // 3) nada resolveu — devolve a classificação original (erro real de inglês)
  return { level: direct.level, transcriptionFix: null, finalText: rawTranscript };
}
