export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHgA547k5788i59mlE7KeAzaIM-lfZBHq900iVTHnja-bTpr02JV32NuHjiOWHQImJcw/exec";
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

export function normalizeAssessment(row: AssessmentData): AssessmentData {
  if (!row || typeof row !== "object") return row;
  const norm = { ...row };

  norm.name = String(norm.name || "").trim();
  norm.phone = String(norm.phone || "").trim();
  norm.email = String(norm.email || "").trim();
  norm.date = String(norm.date || "").trim();

  const isStatus = (v: string) => /^(completed|in progress|new)$/i.test(String(v || "").trim());
  const isFoodPref = (v: string) => /^(vegetarian|non-vegetarian|eggetarian|egg|veg|non-veg)$/i.test(String(v || "").trim());
  const isTimeOrDate = (v: string) => /1899|GMT|:\d{2}|AM|PM/i.test(String(v || "").trim());

  // Safe shifted check: ONLY shift if goals contains a status string or foodPref contains time/date without duty
  const isShifted = !norm.duty && (isStatus(norm.goals) || (isTimeOrDate(norm.foodPref) && !isFoodPref(norm.targetWeight)));

  if (isShifted) {
    const realStatus = isStatus(norm.goals) ? norm.goals : (isStatus(norm.status) ? norm.status : "New");
    const realGoals = norm.allergies && !isStatus(norm.allergies) ? norm.allergies : (norm.goals && !isStatus(norm.goals) ? norm.goals : "Fitness");
    const realAllergies = norm.workTime && !isTimeOrDate(norm.workTime) ? norm.workTime : "";
    const realMedical = norm.collegeTime && !isTimeOrDate(norm.collegeTime) ? norm.collegeTime : "";
    const realSupplements = norm.medicalConditions && !isTimeOrDate(norm.medicalConditions) ? norm.medicalConditions : "";
    const realFoodPref = isFoodPref(norm.targetWeight) ? norm.targetWeight : (isFoodPref(norm.foodPref) ? norm.foodPref : "Vegetarian");

    norm.duty = norm.duty && !isTimeOrDate(norm.duty) ? norm.duty : "";
    norm.restTime = norm.restTime && isTimeOrDate(norm.restTime) ? norm.restTime : "";
    norm.foodPref = realFoodPref;
    norm.collegeTime = isTimeOrDate(norm.weightChange) ? norm.weightChange : "";
    norm.workTime = isTimeOrDate(norm.foodPref) ? norm.foodPref : "";
    norm.medicalConditions = realMedical || "None";
    norm.allergies = realAllergies || "None";
    norm.supplements = realSupplements || "None";
    norm.goals = realGoals;
    norm.status = realStatus;

    if (norm.remarks && (norm.remarks.startsWith("[") || norm.remarks.startsWith("{"))) {
      norm.earlyMorning = norm.remarks;
      norm.remarks = "";
    }
  } else {
    // Sanitize normal rows
    if (isStatus(norm.goals)) {
      norm.status = norm.goals;
      norm.goals = norm.allergies && !isStatus(norm.allergies) ? norm.allergies : "Fitness";
    }
    if (isTimeOrDate(norm.foodPref)) {
      norm.workTime = norm.foodPref;
      norm.foodPref = "Vegetarian";
    }
    if (isTimeOrDate(norm.allergies)) {
      norm.allergies = "None";
    }
    if (isTimeOrDate(norm.medicalConditions)) {
      norm.medicalConditions = "None";
    }
    if (!norm.medicalConditions || norm.medicalConditions === "0" || norm.medicalConditions === "undefined") {
      norm.medicalConditions = "None";
    }
    if (!norm.allergies || norm.allergies === "0" || norm.allergies === "undefined") {
      norm.allergies = "None";
    }
    if (!norm.supplements || norm.supplements === "0" || norm.supplements === "undefined") {
      norm.supplements = "None";
    }
  }

  // Canonicalize foodPref
  let fp = String(norm.foodPref || "").trim();
  if (/^veg(etarian)?$/i.test(fp)) fp = "Vegetarian";
  else if (/^non-?veg(etarian)?$/i.test(fp)) fp = "Non-Vegetarian";
  else if (/^egg(etarian)?$/i.test(fp)) fp = "Eggitarian";
  norm.foodPref = fp || "Vegetarian";

  // Canonicalize status
  let st = String(norm.status || "").trim();
  if (/^completed$/i.test(st)) st = "Completed";
  else if (/^in\s*progress$/i.test(st)) st = "In Progress";
  else if (!st || /^new$/i.test(st)) st = "New";
  norm.status = st;

  return norm;
}

const LOCAL_KEY = "me_assessments";
const CACHE_TS_KEY = "me_assessments_ts";
const CACHE_TTL = 60_000; // 60 seconds — only re-fetch from Sheets if older than this

function getLocal(): AssessmentData[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    return Array.isArray(raw) ? raw.map(normalizeAssessment) : [];
  } catch {
    return [];
  }
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
  // Use timestamp as unique ID — guarantees every submission is unique
  const id = String(Date.now());
  const payload = {
    ...data,
    targetWeight: data.targetWeight || "",
    weightChange: data.weightChange || "",
    id,
    action: "submit"
  };

  const existing = getLocal();
  existing.unshift(normalizeAssessment({ ...payload, _rowIndex: existing.length }));
  saveLocal(existing);

  const params: Record<string, string> = {};
  Object.entries(payload).forEach(([k, v]) => { params[k] = String(v ?? ""); });
  const qs = new URLSearchParams({ ...params, token: T }).toString();
  const url = `${APPS_SCRIPT_URL}?${qs}`;

  // Single GET request — no-cors to avoid CORS redirect blocks
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
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout
    const res = await fetch(`${APPS_SCRIPT_URL}?action=list&token=${T}&_t=${Date.now()}`, {
      method: "GET", redirect: "follow", cache: "no-store", signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json?.data && Array.isArray(json.data)) {
      const indexedData = json.data
        .map((item: AssessmentData, i: number) => ({
          ...item,
          _rowIndex: item._rowIndex ?? i
        }))
        .map(normalizeAssessment);
      saveLocal(indexedData);
      return indexedData;
    }
  } catch {
    // Sheets unavailable — return local cache silently
  }

  return local;
}

// Always force fresh from Sheets (for Track Record)
export async function fetchFresh(): Promise<AssessmentData[]> {
  return fetchSubmissions(true);
}

export async function updateRecord(rowIndex: number, updates: Partial<AssessmentData>): Promise<void> {
  const existing = getLocal();
  const localIdx = existing.findIndex(e => (e._rowIndex ?? existing.indexOf(e)) === rowIndex);
  if (localIdx >= 0) {
    existing[localIdx] = { ...existing[localIdx], ...updates };
    saveLocal(existing);
  }
  // Fire-and-forget to Google Sheets
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
  // Delete from Google Sheets — rowIndex is the 0-based data row index
  scriptGet({ action: "deleteRow", rowIndex: String(rowIndex) });
}
