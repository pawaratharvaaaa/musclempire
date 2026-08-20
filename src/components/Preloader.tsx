import { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import heroBg from "@/assets/images/hero-bg.png";
import { FEATURES } from "@/components/WhyChooseUs";

const IMAGES_TO_PRELOAD = [
  heroBg,
  ...FEATURES.map(f => f.src)
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const total = IMAGES_TO_PRELOAD.length;

    if (total === 0) {
      onComplete();
      return;
    }

    // Preload images
    IMAGES_TO_PRELOAD.forEach(src => {
      const img = new Image();
      img.src = src;
      
      const handleLoad = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
          setTimeout(onComplete, 600); // Small delay so the 100% bar is visible
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; // Proceed even if an image fails to load
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#111111] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <img 
          src={logo} 
          alt="Muscle Empire Gymnasium" 
          className="w-48 md:w-64 h-auto mb-8 object-contain drop-shadow-[0_0_35px_rgba(232,168,32,0.6)]" 
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-[#E8A820] transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(232,168,32,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
