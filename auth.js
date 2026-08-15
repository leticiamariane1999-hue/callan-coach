/* ==========================================================================
   CALLAN COACH — VERIFICAÇÃO DE ASSINATURA (Supabase)
   Cada pessoa entra com o próprio e-mail. O app pergunta ao Supabase
   "esse e-mail está ativo?" — sem conseguir ver a lista de outros
   e-mails (a função no banco só responde sim/não).
   ========================================================================== */

// PREENCHA com os dados do SEU projeto Supabase (Project Settings → API).
// A "anon key" é pública por design — a proteção real está nas regras (RLS)
// do banco, não em esconder essa chave.
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA-CHAVE-ANON-AQUI";

const AUTH_RECHECK_DAYS = 3; // depois de validado, só confere de novo a cada X dias (funciona offline nesse meio tempo)

async function checkEmailActive(email) {
  if (SUPABASE_URL.includes("SEU-PROJETO")) {
    // Supabase ainda não configurado — não bloqueia (modo teste/local).
    return { ok: true, configured: false };
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_email_active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ check_email: email }),
    });
    if (!res.ok) return { ok: false, configured: true, error: "network" };
    const active = await res.json();
    return { ok: !!active, configured: true };
  } catch (e) {
    return { ok: false, configured: true, error: "offline" };
  }
}

async function getStoredAuth() {
  const rows = await Store.getAll("settings");
  const map = {}; for (const r of rows) map[r.key] = r.value;
  return { email: map.authorizedEmail || null, at: map.authorizedAt || 0 };
}

async function isAuthValidLocally() {
  const { email, at } = await getStoredAuth();
  if (!email || !at) return false;
  const ageDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
  return ageDays < AUTH_RECHECK_DAYS;
}

async function requireSubscriptionGate() {
  if (SUPABASE_URL.includes("SEU-PROJETO")) return true; // não configurado ainda → não bloqueia
  if (await isAuthValidLocally()) return true;
  renderAuthGate();
  return false;
}

function renderAuthGate(errorMsg) {
  app.innerHTML = `
    <div class="onboarding">
      <h1>CALLAN COACH</h1>
      <p>Acesso por assinatura — digite o e-mail que você usou na compra.</p>
      <label>Seu e-mail<input id="authEmail" type="email" placeholder="voce@email.com" /></label>
      ${errorMsg ? `<p class="fb warn" style="margin-top:8px">${escapeHtml(errorMsg)}</p>` : ""}
      <button class="btn block" onclick="submitAuthEmail()">Entrar</button>
      <p class="muted small" style="margin-top:16px">Assinou agora? Pode levar alguns minutos até liberar. Se o problema continuar, verifique se digitou o mesmo e-mail da compra.</p>
    </div>
  `;
}

async function submitAuthEmail() {
  const email = document.getElementById("authEmail").value.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    renderAuthGate("Digite um e-mail válido.");
    return;
  }
  const btn = document.querySelector(".onboarding .btn");
  if (btn) { btn.textContent = "Verificando…"; btn.disabled = true; }

  const result = await checkEmailActive(email);
  if (result.ok) {
    await setSettings({ authorizedEmail: email, authorizedAt: Date.now() });
    location.reload();
  } else if (result.error === "offline") {
    renderAuthGate("Não consegui verificar agora — confira sua internet e tente de novo.");
  } else {
    renderAuthGate("E-mail não encontrado como assinante ativo.");
  }
}
