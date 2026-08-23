// All gallery content (images + videos) is synced via Google Sheets.
// Images are URL-only — no base64/IndexedDB. Works across all devices.

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVfFmJLP1AUrm7Fm3VDiwoWLYMMNvaqZuzY6caLQi7sBeaKDDWJoArRphAdcfKP3bulA/exec";

const IMAGES_KEY = "me_gallery_images";
const IMAGES_TS_KEY = "me_gallery_images_ts";
const VIDEOS_KEY = "me_gallery_videos";
const VIDEOS_TS_KEY = "me_gallery_videos_ts";
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

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

// ── localStorage helpers ─────────────────────────────────────────────────────

function getLocalImages(): GalleryImage[] {
  try { return JSON.parse(localStorage.getItem(IMAGES_KEY) || "[]"); } catch { return []; }
}

function saveLocalImages(images: GalleryImage[]): void {
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  localStorage.setItem(IMAGES_TS_KEY, String(Date.now()));
}

function isImagesCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(IMAGES_TS_KEY) || "0", 10);
  return Date.now() - ts > CACHE_TTL;
}

function getLocalVideos(): GalleryVideo[] {
  try { return JSON.parse(localStorage.getItem(VIDEOS_KEY) || "[]"); } catch { return []; }
}

function saveLocalVideos(videos: GalleryVideo[]): void {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  localStorage.setItem(VIDEOS_TS_KEY, String(Date.now()));
}

function isVideosCacheStale(): boolean {
  const ts = parseInt(localStorage.getItem(VIDEOS_TS_KEY) || "0", 10);
  return Date.now() - ts > CACHE_TTL;
}

// ── Sheets helpers ───────────────────────────────────────────────────────────

async function fetchImagesFromSheets(): Promise<GalleryImage[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getImages&_t=${Date.now()}`, { redirect: "follow", cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.images) ? json.images : null;
  } catch { return null; }
}

function saveImagesToSheets(images: GalleryImage[]): void {
  const data = encodeURIComponent(JSON.stringify(images));
  fetch(`${APPS_SCRIPT_URL}?action=saveImages&data=${data}`, {
    method: "GET",
    mode: "no-cors",
  }).catch(() => {});
}

async function fetchVideosFromSheets(): Promise<GalleryVideo[] | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getVideos&_t=${Date.now()}`, { redirect: "follow", cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.videos) ? json.videos : null;
  } catch { return null; }
}

function saveVideosToSheets(videos: GalleryVideo[]): void {
  const data = encodeURIComponent(JSON.stringify(videos));
  fetch(`${APPS_SCRIPT_URL}?action=saveVideos&data=${data}`, {
    method: "GET",
    mode: "no-cors",
  }).catch(() => {});
}

// ── Public API — Images ──────────────────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const local = getLocalImages();

  if (isImagesCacheStale()) {
    fetchImagesFromSheets().then(remote => {
      if (remote !== null) {
        const images = remote.length > 0 ? remote : DEFAULT_IMAGES;
        saveLocalImages(images);
        window.dispatchEvent(new CustomEvent("galleryUpdated"));
      }
    });
  }

  return local.length > 0 ? local : DEFAULT_IMAGES;
}

export async function addGalleryImage(src: string, alt: string): Promise<void> {
  if (src.startsWith("data:")) {
    throw new Error("Please use a URL (from imgbb.com etc.) instead of uploading a file. File uploads are device-specific.");
  }
  const images = getLocalImages().length > 0 ? getLocalImages() : [...DEFAULT_IMAGES];
  images.push({ id: Date.now().toString(), src, alt });
  saveLocalImages(images);
  saveImagesToSheets(images);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryImage(id: string): Promise<void> {
  const images = (getLocalImages().length > 0 ? getLocalImages() : DEFAULT_IMAGES).filter(i => i.id !== id);
  saveLocalImages(images);
  saveImagesToSheets(images);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function syncImagesFromSheets(): Promise<void> {
  const remote = await fetchImagesFromSheets();
  if (remote !== null) {
    saveLocalImages(remote.length > 0 ? remote : DEFAULT_IMAGES);
    window.dispatchEvent(new CustomEvent("galleryUpdated"));
  }
}

// ── Public API — Videos ──────────────────────────────────────────────────────

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  const local = getLocalVideos();

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
  if (src.startsWith("data:")) {
    throw new Error("Please use a URL (YouTube, direct link) instead of uploading a file.");
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

export async function syncVideosFromSheets(): Promise<void> {
  const remote = await fetchVideosFromSheets();
  if (remote !== null) {
    saveLocalVideos(remote);
    window.dispatchEvent(new CustomEvent("galleryUpdated"));
  }
}
