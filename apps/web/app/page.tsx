import { getHomepage, getFeaturedArticles, getSkills, getExperience } from "@/lib/api"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedProjects } from "@/components/home/FeaturedProjects"
import { AboutSection } from "@/components/home/AboutSection"
import { SkillsSection } from "@/components/home/SkillsSection"
import { ExperienceSection } from "@/components/home/ExperienceSection"
import { LatestArticles } from "@/components/home/LatestArticles"
import { ContactCTA } from "@/components/home/ContactCTA"

export default async function HomePage() {
  const homepageData = await getHomepage()

  if (!homepageData?.data) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-muted-foreground">
          Content is being loaded. Please check back soon.
        </p>
      </div>
    )
  }

  const { hero, about, featuredProjects, latestArticles, contactCta } = homepageData.data.attributes

  const [skillsData, experienceData, articlesData] = await Promise.all([
    getSkills(),
    getExperience(),
    getFeaturedArticles(),
  ])

  const skills = skillsData?.data || []
  const experience = experienceData?.data || []
  const articles = articlesData?.data || []

  return (
    <>
      <HeroSection hero={hero} />
      <FeaturedProjects
        projects={featuredProjects?.projects || []}
        title={featuredProjects?.title}
      />
      <AboutSection about={about} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <LatestArticles articles={articles} />
      <ContactCTA
        title={contactCta?.title}
        description={contactCta?.description}
        buttonText={contactCta?.button_label}
      />
    </>
  )
}
