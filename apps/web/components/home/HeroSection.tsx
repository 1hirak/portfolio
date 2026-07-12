import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialLinks } from "@/components/shared/SocialLinks"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import type { HeroSection as HeroSectionType } from "@/lib/api"

interface HeroSectionProps {
  hero: HeroSectionType | null
}

export function HeroSection({ hero }: HeroSectionProps) {
  if (!hero) return null

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit">
              <MapPin className="mr-1 h-3 w-3" />
              {hero.availability_status}
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.name}
            </h1>

            <p className="text-xl text-muted-foreground">{hero.title}</p>

            <p className="text-lg text-muted-foreground max-w-xl">
              {hero.positioningStatement}
            </p>

            <div className="flex items-center gap-4">
              {hero.social_links && (
                <SocialLinks links={hero.social_links} />
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {hero.cta_buttons?.map((cta, i) => (
                <Button key={i} variant={cta.variant as "default" | "secondary" | "outline" | null | undefined || "default"} asChild>
                  <Link href={cta.url}>
                    {cta.text}
                    {cta.variant === "primary" && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            {hero.profile_image && (
              <div className="relative h-72 w-72 md:h-96 md:w-96 overflow-hidden rounded-full border-4 border-muted">
                <ImageWithFallback
                  src={hero.profile_image.url}
                  alt={hero.profile_image.alternativeText || hero.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
