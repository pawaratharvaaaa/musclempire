export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJqmbK8TXYAv5wJpTLnklsiX1MJll_4kUZYaZ0nbGLnBkobv2ItznhQVPsx4WjXGyKXw/exec";
const T = ["ZujXfS4o6t","pRWL2vQmAT","JbEFBaVKCs","1O7UGPqDyk"].join("");

export type AssessmentData = {
  id?: string;
  _rowIndex?: number;
  date: string; name: string; phone: string; email: string;
  age: string; gender: string; weight: string; height: string;
  bmi: string; bmiCategory: string; wakeTime: string; bedTime: string;
  sleepDuration: string; workoutTime: string; targetWeight: string;
  weightChange: string; foodPref: string; duty?: string; restTime?: string;
  collegeTime: string; workTime: string;
  medicalConditions: string; allergies: string; supplements: string;
  goals: string; remarks: string; status: string;
  foodHistory?: string;
  earlyMorning?: string; breakfast?: string; midMorning?: string;
  lunch?: string; eveningSnack?: string; preWorkout?: string;
  postWorkout?: string; dinner?: string; beforeBed?: string;
  supplementsPlan?: string; notes?: string;
};

const LOCAL_KEY = "me_assessments";
const CACHE_TS_KEY = "me_assessments_ts";
const CACHE_TTL = 60_000; // 60 seconds â€” only re-fetch from Sheets if older than this

function getLocal(): AssessmentData[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return []; }
}
function saveLocal(data: AssessmentData[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
}
function isCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || "0", 10);
  return Date.now() - ts > CACHE_TTL;
}

function scriptGet(params: Record<string, string>): Promise<unknown> {
  const qs = new URLSearchParams({ ...params, token: T }).toString();
  return fetch(`${APPS_SCRIPT_URL}?${qs}`, { method: "GET", redirect: "follow" })
    .then(r => r.json()).catch(() => null);
}

export async function submitAssessment(data: AssessmentData): Promise<void> {
  // Use timestamp as unique ID â€” guarantees every submission is unique
  const id = String(Date.now());
  const payload = {
    ...data,
    targetWeight: data.targetWeight || "",
    weightChange: data.weightChange || "",
    id,
    action: "submit"
  };

  const existing = getLocal();
  existing.unshift({ ...payload, _rowIndex: existing.length });
  saveLocal(existing);

  const params: Record<string, string> = {};
  Object.entries(payload).forEach(([k, v]) => { params[k] = String(v ?? ""); });
  const qs = new URLSearchParams({ ...params, token: T }).toString();
  const url = `${APPS_SCRIPT_URL}?${qs}`;

  // Single GET request â€” no-cors to avoid CORS redirect blocks
  fetch(url, { method: "GET", mode: "no-cors" }).catch(() => {});
}

// Fast: returns localStorage immediately, falls back gracefully on Sheets error
export async function fetchSubmissions(forceRefresh = false): Promise<AssessmentData[]> {
  const local = getLocal();

  if (!forceRefresh && !isCacheStale() && local.length > 0) {
    return local; // serve from cache instantly
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 8s timeout
    const res = await fetch(`${APPS_SCRIPT_URL}?action=list&token=${T}&_t=${Date.now()}`, {
      method: "GET", redirect: "follow", cache: "no-store", signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json?.data) {
      saveLocal(json.data);
      return json.data;
    }
  } catch {
    // Sheets unavailable â€” return local cache silently
  }

  return local;
}

// Always force fresh from Sheets (for Track Record)
export async function fetchFresh(): Promise<AssessmentData[]> {
  return fetchSubmissions(true);
}

export async function updateRecord(rowIndex: number, updates: Partial<AssessmentData>): Promise<void> {
  const existing = getLocal();
  if (existing[rowIndex]) {
    existing[rowIndex] = { ...existing[rowIndex], ...updates };
    saveLocal(existing);
  }
  // Fire-and-forget
  const params: Record<string, string> = { action: "update", rowIndex: String(rowIndex) };
  Object.entries(updates).forEach(([k, v]) => { params[k] = String(v ?? ""); });
  scriptGet(params);
}

export async function deleteRecord(rowIndex: number): Promise<void> {
  // Delete from local cache by finding the item with matching _rowIndex
  const existing = getLocal();
  const localIdx = existing.findIndex(e => (e._rowIndex ?? existing.indexOf(e)) === rowIndex);
  if (localIdx >= 0) {
    existing.splice(localIdx, 1);
    existing.forEach((item, i) => { item._rowIndex = i; });
    saveLocal(existing);
  }
  // Delete from Google Sheets â€” rowIndex is the 0-based data row index
  scriptGet({ action: "deleteRow", rowIndex: String(rowIndex) });
}




