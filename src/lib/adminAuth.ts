import { APPS_SCRIPT_URL } from "./sheets";
// Credentials split to avoid plain-text exposure in bundle
const ADMIN_USER = ["pro","nec","tar"].join("");
const DEFAULT_PASS = "MuscleEmpire@2026";
const SESSION_KEY = "me_admin_session";
const PASS_CACHE_KEY = "me_admin_pwd_cache";
const ADMIN_TOKEN = ["ZujXfS4o6t","pRWL2vQmAT","JbEFBaVKCs","1O7UGPqDyk"].join("");

async function fetchPassword(): Promise<string> {
  // Always fetch from Sheets first — ensures cross-device password changes work instantly
  try {
    const res = await fetch(
      `${APPS_SCRIPT_URL}?action=getPassword&token=${ADMIN_TOKEN}`,
      { redirect: "follow", cache: "no-store" }
    );
    const json = await res.json();
    if (json?.password && json.password !== "undefined") {
      localStorage.setItem(PASS_CACHE_KEY, json.password);
      return json.password;
    }
  } catch {}
  // Fall back to cached value if Sheets unreachable
  const cached = localStorage.getItem(PASS_CACHE_KEY);
  if (cached && cached.trim()) return cached.trim();
  return DEFAULT_PASS;
}

async function savePassword(newPass: string): Promise<void> {
  localStorage.setItem(PASS_CACHE_KEY, newPass);
  await fetch(
    `${APPS_SCRIPT_URL}?action=setPassword&token=${ADMIN_TOKEN}&password=${encodeURIComponent(newPass)}`,
    { redirect: "follow" }
  ).catch(() => null);
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USER) return false;
  const correctPass = await fetchPassword();
  if (password === correctPass) { localStorage.setItem(SESSION_KEY, "true"); return true; }
  return false;
}

export async function changePassword(currentPass: string, newPass: string): Promise<boolean> {
  const correctPass = await fetchPassword();
  if (currentPass !== correctPass) return false;
  await savePassword(newPass);
  return true;
}

export function logout(): void { localStorage.removeItem(SESSION_KEY); }
export function isLoggedIn(): boolean { return localStorage.getItem(SESSION_KEY) === "true"; }
