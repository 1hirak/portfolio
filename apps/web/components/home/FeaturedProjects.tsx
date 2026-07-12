import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import type { StrapiData, ProjectAttributes } from "@/lib/api"

interface FeaturedProjectsProps {
  projects: StrapiData<ProjectAttributes>[]
  title?: string
}

export function FeaturedProjects({ projects, title }: FeaturedProjectsProps) {
  if (!projects?.length) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {title || "Featured Projects"}
            </h2>
            <p className="text-muted-foreground mt-2">
              Some of my recent work
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">
              View all projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => {
            const p = project.attributes
            return (
              <Link key={project.id} href={`/projects/${p.slug}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <ImageWithFallback
                      src={p.cover?.url || '/placeholder.svg'}
                      alt={p.cover?.alternativeText || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(p.tech_stack || []).slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {(p.tech_stack?.length || 0) > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{p.tech_stack.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
