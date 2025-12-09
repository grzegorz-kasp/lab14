"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ImageModal() {
  const router = useRouter();
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={() => router.back()}
    >
      <dialog 
        className="relative max-w-[90vw] max-h-[90vh] bg-transparent border-0 p-0"
        open
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Image
            src="/img/produkt.jpg"
            alt="Produkt"
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            style={{ objectFit: "contain" }}
            priority
          />
          <button
            onClick={() => router.back()}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl transition-colors"
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>
      </dialog>
    </div>
  );
}
