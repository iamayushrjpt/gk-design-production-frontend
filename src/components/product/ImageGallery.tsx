import { useState } from "react";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goTo = (i: number) => setActiveIndex((i + images.length) % images.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-gk-lg overflow-hidden bg-stone-200 group">
        <img
          src={images[activeIndex]}
          alt={`${alt} — view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors"
        >
          <Expand size={16} className="text-ink" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
              className={`w-16 h-16 rounded-gk-sm overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-gold-deep" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-6">
          <button
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen preview"
            className="absolute top-6 right-6 text-ivory hover:text-gold transition-colors"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous image"
            className="absolute left-6 top-1/2 -translate-y-1/2 text-ivory hover:text-gold transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[activeIndex]}
            alt={`${alt} — fullscreen view ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next image"
            className="absolute right-6 top-1/2 -translate-y-1/2 text-ivory hover:text-gold transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
