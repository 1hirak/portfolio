"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ImageData } from "@/lib/api"

interface ProjectGalleryProps {
  images: ImageData[]
  layout?: "grid" | "masonry"
}

export function ProjectGallery({ images, layout = "grid" }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images?.length) return null

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      <div
        className={
          layout === "masonry"
            ? "columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        }
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={cn(
              "relative overflow-hidden rounded-lg group cursor-pointer",
              layout === "grid" && "aspect-video"
            )}
          >
            <Image
              src={image.url}
              alt={image.alternativeText || `Gallery image ${index + 1}`}
              fill={layout === "grid"}
              width={layout === "masonry" ? 400 : undefined}
              height={layout === "masonry" ? 300 : undefined}
              className={cn(
                "object-cover transition-transform group-hover:scale-105",
                layout === "masonry" && "w-full h-auto"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Grid3X3 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={goPrevious}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alternativeText || `Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <button
            onClick={goNext}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
