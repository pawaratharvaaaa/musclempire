// Gallery store — Sheets is source of truth. No defaults pushed to Sheets.

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt16aWEy6Wq9Unm8mgCL-0V9dp3CEBcB3kNAqWtaFu9Q9_-tAlWyTjGSiRbtMSkGo60Q/exec";
const T = ["ZujXfS4o6t","pRWL2vQmAT","JbEFBaVKCs","1O7UGPqDyk"].join("");

const IMAGES_KEY = "me_gallery_images_v2"; // v2 = no defaults, Sheets only
const IMAGES_TS_KEY = "me_gallery_images_ts";
const VIDEOS_KEY = "me_gallery_videos_v2";
const VIDEOS_TS_KEY = "me_gallery_videos_ts";
const CACHE_TTL = 60 * 1000; // 1 min

export interface GalleryImage { id: string; src: string; alt: string; }
export interface GalleryVideo { id: string; src: string; alt: string; thumbnail?: string; }

// ── localStorage helpers ─────────────────────────────────────────────────────

function getLocalImages(): GalleryImage[] {
  try { return JSON.parse(localStorage.getItem(IMAGES_KEY) || "[]"); } catch { return []; }
}
function saveLocalImages(images: GalleryImage[]): void {
  // Deduplicate by id before saving
  const seen = new Set<string>();
  const deduped = images.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
  localStorage.setItem(IMAGES_KEY, JSON.stringify(deduped));
  localStorage.setItem(IMAGES_TS_KEY, String(Date.now()));
}
function isImagesCacheStale(): boolean {
  return Date.now() - parseInt(localStorage.getItem(IMAGES_TS_KEY) || "0", 10) > CACHE_TTL;
}

function getLocalVideos(): GalleryVideo[] {
  try { return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "[]"); } catch { return []; }
}
function saveLocalVideos(videos: GalleryVideo[]): void {
  const seen = new Set<string>();
  const deduped = videos.filter(v => { if (seen.has(v.id)) return false; seen.add(v.id); return true; });
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(deduped));
  localStorage.setItem(VIDEOS_TS_KEY, String(Date.now()));
}
function isVideosCacheStale(): boolean {
  return Date.now() - parseInt(localStorage.getItem(VIDEOS_TS_KEY) || "0", 10) > CACHE_TTL;
}

// ── Sheets ────────────────────────────────────────────────────────────────────

async function fetchImagesFromSheets(): Promise<GalleryImage[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getImages&token=${T}&_t=${Date.now()}`, {
      redirect: "follow", cache: "no-store",
    });
    const json = await res.json();
    return Array.isArray(json?.images) ? json.images : null;
  } catch { return null; }
}

function saveImagesToSheets(images: GalleryImage[]): void {
  if (images.length === 0) return; // never wipe Sheets with empty array
  const data = encodeURIComponent(JSON.stringify(images));
  fetch(`${APPS_SCRIPT_URL}?action=saveImages&token=${T}&data=${data}`, {
    method: "GET", mode: "no-cors",
  }).catch(() => {});
}

async function fetchVideosFromSheets(): Promise<GalleryVideo[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getVideos&token=${T}&_t=${Date.now()}`, {
      redirect: "follow", cache: "no-store",
    });
    const json = await res.json();
    return Array.isArray(json?.videos) ? json.videos : null;
  } catch { return null; }
}

function saveVideosToSheets(videos: GalleryVideo[]): void {
  if (videos.length === 0) return; // never wipe Sheets with empty array
  const data = encodeURIComponent(JSON.stringify(videos));
  fetch(`${APPS_SCRIPT_URL}?action=saveVideos&token=${T}&data=${data}`, {
    method: "GET", mode: "no-cors",
  }).catch(() => {});
}

// ── Public API — Images ──────────────────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  // Always pull from Sheets if cache is stale
  if (isImagesCacheStale()) {
    const remote = await fetchImagesFromSheets();
    if (remote !== null) {
      saveLocalImages(remote);
      window.dispatchEvent(new CustomEvent("galleryUpdated"));
      return remote;
    }
  }
  return getLocalImages();
}

export async function syncImagesFromSheets(): Promise<void> {
  const remote = await fetchImagesFromSheets();
  if (remote !== null) {
    saveLocalImages(remote);
    window.dispatchEvent(new CustomEvent("galleryUpdated"));
  }
}

export async function addGalleryImage(src: string, alt: string): Promise<void> {
  if (src.startsWith("data:")) throw new Error("Use a URL (imgbb.com) instead of uploading a file.");
  // Pull fresh first to avoid duplicates
  const remote = await fetchImagesFromSheets();
  const current = remote ?? getLocalImages();
  // Check for duplicate src
  if (current.find(i => i.src === src)) return;
  current.push({ id: Date.now().toString(), src, alt });
  saveLocalImages(current);
  saveImagesToSheets(current);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryImage(id: string): Promise<void> {
  // Pull fresh from Sheets first, then remove
  const remote = await fetchImagesFromSheets();
  const current = (remote ?? getLocalImages()).filter(i => i.id !== id);
  saveLocalImages(current);
  saveImagesToSheets(current);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

// ── Public API — Videos ──────────────────────────────────────────────────────

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  if (isVideosCacheStale()) {
    const remote = await fetchVideosFromSheets();
    if (remote !== null) {
      saveLocalVideos(remote);
      window.dispatchEvent(new CustomEvent("galleryUpdated"));
      return remote;
    }
  }
  return getLocalVideos();
}

export async function syncVideosFromSheets(): Promise<void> {
  const remote = await fetchVideosFromSheets();
  if (remote !== null) {
    saveLocalVideos(remote);
    window.dispatchEvent(new CustomEvent("galleryUpdated"));
  }
}

export async function addGalleryVideo(src: string, alt: string, thumbnail?: string): Promise<void> {
  if (src.startsWith("data:")) throw new Error("Use a URL instead of uploading a file.");
  const remote = await fetchVideosFromSheets();
  const current = remote ?? getLocalVideos();
  if (current.find(v => v.src === src)) return;
  current.push({ id: Date.now().toString(), src, alt, thumbnail });
  saveLocalVideos(current);
  saveVideosToSheets(current);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryVideo(id: string): Promise<void> {
  const remote = await fetchVideosFromSheets();
  const current = (remote ?? getLocalVideos()).filter(v => v.id !== id);
  saveLocalVideos(current);
  saveVideosToSheets(current);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}
