import { APPS_SCRIPT_URL } from "./sheets";
const ADMIN_USER = "pronectar";
const DEFAULT_PASS = "MuscleEmpire@2026";
const SESSION_KEY = "me_admin_session";
const PASS_CACHE_KEY = "me_admin_pwd_cache";
const ADMIN_TOKEN = "ME9773GYM";

async function fetchPassword(): Promise<string> {
  // 1. Check localStorage cache first (set on successful password change)
  const cached = localStorage.getItem(PASS_CACHE_KEY);
  if (cached && cached.trim()) return cached.trim();
  // 2. Try fetching from Sheets
  try {
    const res = await fetch(
      `${APPS_SCRIPT_URL}?action=getPassword&token=${ADMIN_TOKEN}`,
      { redirect: "follow" }
    );
    const json = await res.json();
    if (json?.password && json.password !== "undefined") {
      localStorage.setItem(PASS_CACHE_KEY, json.password);
      return json.password;
    }
  } catch {}
  // 3. Fall back to default
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