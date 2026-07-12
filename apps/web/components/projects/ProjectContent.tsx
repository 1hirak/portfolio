import { ExternalLink, GitBranch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { ProjectGallery } from "./ProjectGallery"
import type { RichText, ImageData } from "@/lib/api"

interface ProjectContentProps {
  techStack: string[]
  liveUrl?: string | null
  sourceUrl?: string | null
  client?: string
  role?: string
  timeline?: string
  team?: string
  problem?: RichText
  research?: RichText
  process?: RichText
  designDecisions?: RichText
  technicalDecisions?: RichText
  results?: RichText
  metrics?: { label: string; value: string; prefix?: string; suffix?: string }[]
  gallery?: ImageData[]
}

export function ProjectContent({
  techStack,
  liveUrl,
  sourceUrl,
  client,
  role,
  timeline,
  team,
  problem,
  research,
  process,
  designDecisions,
  technicalDecisions,
  results,
  metrics,
  gallery,
}: ProjectContentProps) {
  const hasMeta = client || role || timeline || team
  const hasContent = problem || research || process || designDecisions || technicalDecisions || results

  return (
    <div>
      {(liveUrl || sourceUrl || hasMeta) && (
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {role && (
            <Badge>{role}</Badge>
          )}
          {client && (
            <span className="text-sm text-muted-foreground">Client: {client}</span>
          )}
          {timeline && (
            <span className="text-sm text-muted-foreground">{timeline}</span>
          )}
          {team && (
            <span className="text-sm text-muted-foreground">Team: {team}</span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {liveUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live Demo
                </a>
              </Button>
            )}
            {sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  <GitBranch className="h-4 w-4 mr-1" />
                  Source Code
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      <Separator className="mb-8" />

      {metrics && metrics.length > 0 && (
        <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 text-center">
              <div className="text-3xl font-bold">
                {metric.prefix && <span>{metric.prefix}</span>}
                {metric.value}
                {metric.suffix && <span>{metric.suffix}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      )}

      {gallery && gallery.length > 0 && (
        <div className="my-8">
          <ProjectGallery images={gallery} layout="grid" />
        </div>
      )}

      {hasContent && (
        <div className="space-y-8">
          {problem && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
              <h3 className="text-lg font-semibold text-destructive mb-3">Problem</h3>
              <div className="prose prose-sm max-w-none">
                <RichTextRenderer content={problem} />
              </div>
            </div>
          )}

          {research && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Research</h2>
              <div className="prose max-w-none">
                <RichTextRenderer content={research} />
              </div>
            </div>
          )}

          {process && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Process</h2>
              <div className="prose max-w-none">
                <RichTextRenderer content={process} />
              </div>
            </div>
          )}

          {designDecisions && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Design Decisions</h2>
              <div className="prose max-w-none">
                <RichTextRenderer content={designDecisions} />
              </div>
            </div>
          )}

          {technicalDecisions && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Technical Decisions</h2>
              <div className="prose max-w-none">
                <RichTextRenderer content={technicalDecisions} />
              </div>
            </div>
          )}

          {results && (
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Results</h3>
              <div className="prose prose-sm max-w-none">
                <RichTextRenderer content={results} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
