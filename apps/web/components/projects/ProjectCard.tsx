import Link from "next/link"
import { ExternalLink, GitBranch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import type { ImageData } from "@/lib/api"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    slug: string
    description: string
    cover: ImageData | null
    techStack: string[]
    liveUrl?: string | null
    sourceUrl?: string | null
    status?: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-video">
          <ImageWithFallback
            src={project.cover?.url || '/placeholder.svg'}
            alt={project.cover?.alternativeText || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {project.status && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {project.status}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.techStack?.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Live
              </a>
            </Button>
          )}
          {project.sourceUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                <GitBranch className="h-3 w-3 mr-1" />
                Source
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
