import type { Metadata } from "next"
import { getProjects } from "@/lib/api"
import { ProjectCard } from "@/components/projects/ProjectCard"

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects I've built and contributed to.",
}

export default async function ProjectsPage() {
  const projectsData = await getProjects()
  const projects = projectsData?.data || []

  if (projects.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-muted-foreground">No projects found yet.</p>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
        <p className="text-muted-foreground">
          Things I&apos;ve built and contributed to.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
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
    </div>
  )
}
