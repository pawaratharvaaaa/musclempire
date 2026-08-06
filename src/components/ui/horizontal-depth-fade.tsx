import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface HorizontalDepthFadeImage {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface HorizontalDepthFadeProps {
  images: HorizontalDepthFadeImage[];
  itemWidth?: number;
  itemHeight?: number;
  gap?: number | string;
  className?: string;
}

export function HorizontalDepthFade({
  images,
  itemWidth = 340,
  itemHeight = 460,
  gap = "2rem",
  className,
}: HorizontalDepthFadeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll multiplier speed
    el.scrollLeft = scrollLeftStart - walk;
  };

  // Parallax scroll effect for desktop columns
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>(".parallax-col");
      const movements = [-100, 100, -180, 80]; // parallax shifting amounts in pixels

      cols.forEach((col, idx) => {
        gsap.fromTo(
          col,
          { y: movements[idx] * -0.5 },
          {
            y: movements[idx] * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2, // Adds a nice slow reaction lag
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  // Split features into 4 columns for desktop
  const splitCols = (arr: typeof images, n: number) => {
    const out: (typeof images)[] = Array.from({ length: n }, () => []);
    arr.forEach((img, i) => out[i % n].push(img));
    return out;
  };

  const columns = splitCols(images, 4);

  return (
    <div ref={containerRef} className={cn("relative w-full z-10", className)}>
      {/* Mobile/Tablet View: Scrollable/Draggable Carousel */}
      <div className="px-5 md:px-8 max-w-7xl mx-auto lg:hidden">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "w-full overflow-x-auto flex snap-x snap-mandatory scroll-smooth py-4 px-1 -mx-1 select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{
            gap,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Webkit scrollbar hiding */}
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar {
              display: none;
            }
          `}} />

          {images.map((img, i) => (
            <div
              key={i}
              className="group relative shrink-0 overflow-hidden rounded-[24px] snap-start transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 pointer-events-none"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
              }}
            >
              {/* Background Image with Zoom effect */}
              <div
                className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt ?? `Image ${i + 1}`}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 text-white transition-opacity duration-300 group-hover:via-black/45" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10 pointer-events-none">
                {img.title && (
                  <h3 className="font-display font-black text-2xl tracking-tight mb-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                    {img.title}
                  </h3>
                )}
                {img.description && (
                  <p className="text-white/70 text-sm font-medium leading-relaxed opacity-90 transition-all duration-500 group-hover:text-white group-hover:-translate-y-1">
                    {img.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View: Vertically scrolling parallax columns responding to page scroll */}
      <div className="hidden lg:block relative w-full px-4 overflow-visible py-16">
        <div className="flex gap-4 overflow-visible">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="parallax-col flex-1 flex flex-col gap-4">
              {col.map((img, i) => (
                <div
                  key={i}
                  className="group relative w-full overflow-hidden rounded-[24px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15 cursor-pointer shrink-0"
                  style={{
                    height: `${itemHeight}px`,
                  }}
                >
                  {/* Background Image with Zoom effect */}
                  <div
                    className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${img.src})` }}
                    role="img"
                    aria-label={img.alt ?? `Image ${i + 1}`}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 text-white transition-opacity duration-300 group-hover:via-black/45" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10 pointer-events-none">
                    {img.title && (
                      <h3 className="font-display font-black text-2xl tracking-tight mb-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                        {img.title}
                      </h3>
                    )}
                    {img.description && (
                      <p className="text-white/70 text-sm font-medium leading-relaxed opacity-90 transition-all duration-500 group-hover:text-white group-hover:-translate-y-1">
                        {img.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HorizontalDepthFade;
