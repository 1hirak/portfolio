import type { StrapiData, ProjectAttributes } from "@/lib/api"
import { ProjectCard } from "./ProjectCard"

interface RelatedProjectsProps {
  projects: StrapiData<ProjectAttributes>[]
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  const filtered = projects.slice(0, 3)

  if (filtered.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              title: project.attributes.title,
              slug: project.attributes.slug,
              description: project.attributes.description,
              cover: project.attributes.cover,
              techStack: project.attributes.tech_stack,
              liveUrl: project.attributes.live_url,
              sourceUrl: project.attributes.repo_url,
              status: project.attributes.role,
            }}
          />
        ))}
      </div>
    </section>
  )
}
