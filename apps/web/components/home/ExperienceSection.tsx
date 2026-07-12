import type { StrapiData, ExperienceItem } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"

interface ExperienceSectionProps {
  experience: StrapiData<ExperienceItem>[] | null
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience?.length) return null

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
          Experience
        </h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 top-0 h-full w-px bg-border" />

          <div className="space-y-10">
            {experience.map((item) => {
              const exp = item.attributes
              return (
                <div key={item.id} className="relative pl-20">
                  <div className="absolute left-4 top-1 h-8 w-8 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{exp.role}</h3>
                      <span className="text-sm text-muted-foreground">
                        @ {exp.company}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </p>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <RichTextRenderer content={exp.description} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
