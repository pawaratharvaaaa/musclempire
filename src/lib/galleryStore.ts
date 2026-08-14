const DB_NAME = "MuscleEmpireGalleryDB";
const DB_VERSION = 1;
const IMAGES_STORE = "images";
const VIDEOS_STORE = "videos";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryVideo {
  id: string;
  src: string;
  alt: string;
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

const DEFAULT_VIDEOS: GalleryVideo[] = [
  { id: "v1", src: "https://assets.mixkit.co/videos/preview/mixkit-man-performing-dumbbell-curls-in-gym-42171-large.mp4", alt: "Hardcore Dumbbell Curls" },
  { id: "v2", src: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-with-a-barbell-in-a-gym-42173-large.mp4", alt: "Heavy Barbell Squats" },
  { id: "v3", src: "https://assets.mixkit.co/videos/preview/mixkit-athlete-man-doing-pulldown-exercises-42180-large.mp4", alt: "High-Intensity Lat Pull-down" },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
        db.createObjectStore(VIDEOS_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllItems<T>(storeName: string): Promise<T[]> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
}

function addItem<T>(storeName: string, item: T): Promise<void> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

function removeItem(storeName: string, id: string): Promise<void> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const items = await getAllItems<GalleryImage>(IMAGES_STORE);
    if (items.length > 0) return items;
    for (const img of DEFAULT_IMAGES) {
      await addItem(IMAGES_STORE, img);
    }
    return DEFAULT_IMAGES;
  } catch {
    return DEFAULT_IMAGES;
  }
}

export async function addGalleryImage(src: string, alt: string): Promise<void> {
  const item: GalleryImage = { id: Date.now().toString(), src, alt };
  await addItem(IMAGES_STORE, item);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryImage(id: string): Promise<void> {
  await removeItem(IMAGES_STORE, id);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  try {
    const items = await getAllItems<GalleryVideo>(VIDEOS_STORE);
    if (items.length > 0) return items;
    for (const vid of DEFAULT_VIDEOS) {
      await addItem(VIDEOS_STORE, vid);
    }
    return DEFAULT_VIDEOS;
  } catch {
    return DEFAULT_VIDEOS;
  }
}

export async function addGalleryVideo(src: string, alt: string): Promise<void> {
  const item: GalleryVideo = { id: Date.now().toString(), src, alt };
  await addItem(VIDEOS_STORE, item);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export async function removeGalleryVideo(id: string): Promise<void> {
  await removeItem(VIDEOS_STORE, id);
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}
