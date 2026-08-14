import { useLayoutEffect, useState } from "react";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { ImageGallery } from "@/components/ui/image-gallery";
import { VideoGallery } from "@/components/ui/video-gallery";

export default function GalleryPage() {
  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <PlanNavbar />
      <main className="pt-24 pb-20">

        {/* Header */}
        <div className="text-center mb-14 px-5 md:px-8">
          <p className="text-[#E8A820] font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-[#E8A820] inline-block" />
            Our Space
            <span className="w-8 h-px bg-[#E8A820] inline-block" />
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8A820] to-yellow-600">
              Gallery
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every corner built for performance, every space designed to inspire.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#E8A820] text-black border-[#E8A820]"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
              activeTab === "videos"
                ? "bg-[#E8A820] text-black border-[#E8A820]"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            Videos
          </button>
        </div>

        {/* Content */}
        {activeTab === "photos" ? <ImageGallery /> : <VideoGallery />}

      </main>
      <Footer />
    </div>
  );
}
