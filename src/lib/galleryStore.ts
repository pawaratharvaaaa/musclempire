// Videos are synced via Google Sheets so they work on all devices.
// Images remain in IndexedDB (base64 uploads are device-local by nature).

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw06TogGaQrRyBdRGHuvEYqBKPfT9f0AFYcB36t-XwJweaLkuT3-wi55un3ckiPMPZOYQ/exec";

const DB_NAME = "MuscleEmpireGalleryDB";
const DB_VERSION = 1;
const IMAGES_STORE = "images";

const VIDEOS_KEY = "me_gallery_videos";
const VIDEOS_TS_KEY = "me_gallery_videos_ts";
const VIDEOS_TTL = 2 * 60 * 1000; // 2 minutes

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryVideo {
  id: string;
  src: string;
  alt: string;
  thumbnail?: string;
}

const DEFAULT_IMAGES: GalleryImage[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", alt: "Main gym floor" },
  { id: "2", src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", alt: "Weight training area" },
  { id: "3", src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", alt: "Cardio zone" },
  { id: "4", src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", alt: "Group class" },
  { id: "5", src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", alt: "Personal training" },
  { id: "6", src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80", alt: "Free weights" },
  { id: "7", src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", alt: "Gym entrance" },
  { id: "8", src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", alt: "Bench press" },
  { id: "9", src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80", alt: "Dumbbell rack" },
  { id: "10", src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", alt: "Stretching area" },
  { id: "11", src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80", alt: "Trainer session" },
  { id: "12", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", alt: "Locker room" },
];

// ── IndexedDB helpers (images only) ─────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllItems<T>(storeName: string): Promise<T[]> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function addItem<T>(storeName: string, item: T): Promise<void> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

function removeItem(storeName: string, id: string): Promise<void> {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  }));
}

// ── Sheets helpers (videos) ──────────────────────────────────────────────────

function getLocalVideos(): GalleryVideo[] {
  try { return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "[]"); } catch { return []; }
}

function saveLocalVideos(videos: GalleryVideo[]): void {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  localStorage.setItem(VIDEOS_TS_KEY, String(Date.now()));
}

function isVideosCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(VIDEOS_TS_KEY) || "0", 10);
  return Date.now() - ts > VIDEOS_TTL;
}

async function fetchVideosFromSheets(): Promise<GalleryVideo[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getVideos&_t=${Date.now()}`, { redirect: "follow" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.videos) ? json.videos : null;
  } catch { return null; }
}

function saveVideosToSheets(videos: GalleryVideo[]): void {
  // POST
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveVideos", data: JSON.stringify(videos) }),
  }).catch(() => {});
  // GET fallback
  const qs = new URLSearchParams({ action: "saveVideos", data: JSON.stringify(videos) }).toString();
  fetch(`${APPS_SCRIPT_URL}?${qs}`, { method: "GET", mode: "no-cors" }).catch(() => {});
}

// ── Public API — Images ──────────────────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const items = await getAllItems<GalleryImage>(IMAGES_STORE);
    if (items.length > 0) return items;
    for (const img of DEFAULT_IMAGES) await addItem(IMAGES_STORE, img);
    return DEFAULT_IMAGES;
  } catch { return DEFAULT_IMAGES; }
}

export async function addGalleryImage(src: string, alt: string): Promise<void> {
  await addItem(IMAGES_STORE, { id: Date.now().toString(), src, alt });
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryImage(id: string): Promise<void> {
  await removeItem(IMAGES_STORE, id);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

// ── Public API — Videos (Sheets-synced) ─────────────────────────────────────

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  // Always serve from cache immediately
  const local = getLocalVideos();

  // Background sync if stale
  if (isVideosCacheStale()) {
    fetchVideosFromSheets().then(remote => {
      if (remote !== null) {
        saveLocalVideos(remote);
        window.dispatchEvent(new CustomEvent("galleryUpdated"));
      }
    });
  }

  return local;
}

export async function addGalleryVideo(src: string, alt: string, thumbnail?: string): Promise<void> {
  // Only allow URLs, not base64
  if (src.startsWith("data:")) {
    throw new Error("Please use a URL (YouTube, direct link) instead of uploading a file. File uploads are device-specific.");
  }
  const videos = getLocalVideos();
  videos.push({ id: Date.now().toString(), src, alt, thumbnail });
  saveLocalVideos(videos);
  saveVideosToSheets(videos);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryVideo(id: string): Promise<void> {
  const videos = getLocalVideos().filter(v => v.id !== id);
  saveLocalVideos(videos);
  saveVideosToSheets(videos);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

/** Force refresh videos from Sheets */
export async function syncVideosFromSheets(): Promise<void> {
  const remote = await fetchVideosFromSheets();
  if (remote !== null) {
    saveLocalVideos(remote);
    window.dispatchEvent(new CustomEvent("galleryUpdated"));
  }
}
