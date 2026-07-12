import type { StrapiData, SkillCategory } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface SkillsSectionProps {
  skills: StrapiData<SkillCategory>[] | null
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills?.length) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
          Skills & Technologies
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border bg-card p-6"
            >
              <h3 className="font-semibold mb-4 text-lg">{category.attributes.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.attributes.skills?.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
