import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ENV_FILE = process.env.ENV_FILE ?? ".env.local";
const TARGETS = ["production", "preview", "development"];
const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DEFAULT_RESTAURANT_ID",
  "NEXT_PUBLIC_APP_LOGIN_ID",
  "NEXT_PUBLIC_APP_LOGIN_PASSWORD",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_ELEVENLABS_AGENT_ID",
  "ORDERS_WEBHOOK_SECRET",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
  "RESTAURANT_NAME",
  "ORDER_PREP_MINUTES",
];

function loadToken() {
  const fromEnv = process.env.VERCEL_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  try {
    const authPath = join(homedir(), "Library/Application Support/com.vercel.cli/auth.json");
    const auth = JSON.parse(readFileSync(authPath, "utf8"));
    return auth.token ?? auth.credentials?.[0]?.token;
  } catch {
    return null;
  }
}

function loadProject() {
  const project = JSON.parse(readFileSync(".vercel/project.json", "utf8"));
  return { projectId: project.projectId, teamId: project.orgId };
}

function parseEnvFile(path) {
  const lines = readFileSync(path, "utf8").split("\n");
  const map = new Map();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    map.set(trimmed.slice(0, idx), trimmed.slice(idx + 1));
  }
  return map;
}

async function api(token, path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 200)}`);
  return json;
}

async function upsertEnv(token, projectId, teamId, key, value, target) {
  const qs = teamId ? `?teamId=${teamId}` : "";
  const existing = await api(token, `/v9/projects/${projectId}/env${qs}`);
  const found = (existing.envs ?? []).find((e) => e.key === key && e.target?.includes(target));
  const payload = { key, value, type: key.startsWith("NEXT_PUBLIC_") ? "plain" : "encrypted", target: [target] };
  if (found) {
    await api(token, `/v9/projects/${projectId}/env/${found.id}${qs}`, { method: "PATCH", body: payload });
    return "updated";
  }
  await api(token, `/v9/projects/${projectId}/env${qs}`, { method: "POST", body: payload });
  return "created";
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error(
      "Token Vercel manquant.\n\n" +
        "  Option A : vercel login\n" +
        "  Option B : creer un token sur https://vercel.com/account/tokens puis :\n" +
        "             VERCEL_TOKEN=xxx npm run sync:vercel\n",
    );
    process.exit(1);
  }
  const { projectId, teamId } = loadProject();
  const env = parseEnvFile(ENV_FILE);
  const results = [];

  for (const key of KEYS) {
    const value = env.get(key)?.trim();
    if (!value) {
      results.push({ key, status: "skipped" });
      continue;
    }
    for (const target of TARGETS) {
      const action = await upsertEnv(token, projectId, teamId, key, value, target);
      results.push({ key, target, action });
    }
  }

  const deploy = await api(token, `/v13/deployments${teamId ? `?teamId=${teamId}` : ""}`, {
    method: "POST",
    body: {
      name: "reception-ai",
      project: projectId,
      target: "production",
      gitSource: { type: "github", ref: "main", repoId: undefined },
    },
  }).catch(async () => {
    return api(token, `/v13/deployments${teamId ? `?teamId=${teamId}` : ""}`, {
      method: "POST",
      body: { name: "reception-ai", project: projectId, target: "production" },
    });
  });

  console.log(JSON.stringify({ projectId, results, deployment: deploy.url ?? deploy.alias?.[0] }, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
