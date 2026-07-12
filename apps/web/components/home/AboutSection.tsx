import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import type { AboutSection as AboutSectionType } from "@/lib/api"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"

interface AboutSectionProps {
  about: AboutSectionType | null
}

export function AboutSection({ about }: AboutSectionProps) {
  if (!about) return null

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
          {about.title}
        </h2>

        <div className="grid items-center gap-10 md:grid-cols-2">
          {about.image && (
            <div className="flex justify-center">
              <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-xl">
                <ImageWithFallback
                  src={about.image.url}
                  alt={about.image.alternativeText || "About me"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="prose max-w-none">
            <RichTextRenderer content={about.content} />
          </div>
        </div>
      </div>
    </section>
  )
}
