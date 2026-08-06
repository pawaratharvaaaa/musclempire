const GALLERY_KEY = "me_gallery_images";

export interface GalleryImage {
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

export function getGalleryImages(): GalleryImage[] {
  try {
    const stored = localStorage.getItem(GALLERY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_IMAGES;
}

export function saveGalleryImages(images: GalleryImage[]): void {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(images));
  window.dispatchEvent(new CustomEvent("galleryUpdated"));
}

export function addGalleryImage(src: string, alt: string): void {
  const images = getGalleryImages();
  images.push({ id: Date.now().toString(), src, alt });
  saveGalleryImages(images);
}

export function removeGalleryImage(id: string): void {
  const images = getGalleryImages().filter(img => img.id !== id);
  saveGalleryImages(images);
}
