import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProject, getRelatedProjects } from "@/lib/api"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { ProjectContent } from "@/components/projects/ProjectContent"
import { RelatedProjects } from "@/components/projects/RelatedProjects"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const projectData = await getProject(slug)
  const project = projectData?.data

  if (!project) return {}

  const { title, description, seo_title, seo_description, cover } = project.attributes

  return {
    title: seo_title || title,
    description: seo_description || description,
    openGraph: {
      title: seo_title || title,
      description: seo_description || description,
      images: cover ? [{ url: cover.url }] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projectData = await getProject(slug)

  if (!projectData?.data) {
    notFound()
  }

  const project = projectData.data
  const relatedData = await getRelatedProjects(project.id)
  const relatedProjects = relatedData?.data || []

  const { title, description, cover, tech_stack, live_url, repo_url, client, role, timeline, team, problem, research, process, design_decisions, technical_decisions, results, metrics, gallery } = project.attributes

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {cover && (
        <div className="relative aspect-video mb-10 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={cover.url}
            alt={cover.alternativeText || title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <ProjectContent
        problem={problem}
        research={research}
        process={process}
        designDecisions={design_decisions}
        technicalDecisions={technical_decisions}
        results={results}
        techStack={tech_stack}
        liveUrl={live_url}
        sourceUrl={repo_url}
        client={client}
        role={role}
        timeline={timeline}
        team={team}
        metrics={metrics}
        gallery={gallery}
      />

      <RelatedProjects projects={relatedProjects} />
    </div>
  )
}
