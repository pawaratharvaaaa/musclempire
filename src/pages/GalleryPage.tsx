import { useLayoutEffect } from "react";
import PlanNavbar from "@/components/PlanNavbar";
import Footer from "@/components/Footer";
import { ImageGallery } from "@/components/ui/image-gallery";

export default function GalleryPage() {
  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

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

        {/* Full-width gallery */}
        <ImageGallery />

      </main>
      <Footer />
    </div>
  );
}
